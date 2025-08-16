<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, PUT, OPTIONS');
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
                $stmt = $conn->prepare("SELECT * FROM projects WHERE id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                $realisation = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($realisation) {
                    $realisation['created_at'] = date('d/m/Y', strtotime($realisation['created_at']));
                    echo json_encode($realisation);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Réalisation non trouvée']);
                }
            } else {
                $stmt = $conn->query("
                    SELECT 
                        id,
                        title,
                        subtitle,
                        image_url,
                        category,
                        slug,
                        DATE_FORMAT(created_at, '%d/%m/%Y') as created_at
                    FROM projects 
                    ORDER BY created_at DESC
                ");
                $realisations = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($realisations);
            }
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit;
            }

            // Récupération des données JSON envoyées
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Données invalides']);
                exit;
            }

            // Préparer les champs à mettre à jour
            $title = $data['title'] ?? null;
            $subtitle = $data['subtitle'] ?? null;
            $category = $data['category'] ?? null;
            $image_url = $data['image_url'] ?? null; // gérer l'image si tu la passes, sinon à adapter

            // Exemple simple, adapte selon ce que tu veux autoriser à mettre à jour
            $stmt = $conn->prepare("
                UPDATE projects 
                SET title = :title, subtitle = :subtitle, category = :category
                WHERE id = :id
            ");
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':subtitle', $subtitle);
            $stmt->bindParam(':category', $category);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode(['success' => true, 'message' => 'Réalisation mise à jour avec succès']);
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM projects WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Réalisation supprimée avec succès']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Réalisation non trouvée']);
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
