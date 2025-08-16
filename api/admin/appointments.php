<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $method = $_SERVER['REQUEST_METHOD'];
    parse_str($_SERVER['QUERY_STRING'], $queryParams);
    $id = isset($queryParams['id']) ? (int)$queryParams['id'] : null;

    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $conn->prepare("SELECT * FROM appointments WHERE id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                $appointment = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($appointment) {
                    // Formater date et heure ensemble
                    $appointment['date_time'] = date('d/m/Y H:i', strtotime($appointment['date'] . ' ' . $appointment['time']));
                    echo json_encode($appointment);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Rendez-vous non trouvé']);
                }
            } else {
                $stmt = $conn->query("
                    SELECT 
                        id,
                        name as client,
                        email,
                        phone,
                        CONCAT(DATE_FORMAT(date, '%d/%m/%Y'), ' ', time) as date_time,
                        message as subject,
                        'Confirmé' as status,  -- Remplacer par champ réel si besoin
                        created_at
                    FROM appointments 
                    ORDER BY date DESC, time DESC
                ");
                $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($appointments);
            }
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM appointments WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Rendez-vous supprimé avec succès']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Rendez-vous non trouvé']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
            break;
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur de base de données',
        'message' => $e->getMessage()
    ]);
}
