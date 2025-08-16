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
            $stmt = $conn->query("
                SELECT 
                    id,
                    fullname,
                    email,
                    phone,
                    objectif,
                    description,
                    besoin,
                    DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
                FROM project_ideas
                ORDER BY created_at DESC
            ");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($projects);
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM project_ideas WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Projet supprimé']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Projet non trouvé']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
            break;
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
