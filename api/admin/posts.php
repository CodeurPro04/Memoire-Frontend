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
                $stmt = $conn->prepare("
            SELECT p.*, c.name AS category_name, c.id AS category_id
            FROM posts p
            LEFT JOIN categories c ON p.category = c.id
            WHERE p.id = :id
        ");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                $post = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($post) {
                    if ($post['published_at']) {
                        $post['published_at'] = date('Y-m-d\TH:i', strtotime($post['published_at']));
                    }
                    $post['category'] = (int)$post['category_id'];

                    // Nettoyer l'excerpt existant
                    $temp = new DOMDocument();
                    $temp->loadHTML($post['excerpt']);
                    $post['excerpt'] = $temp->textContent;

                    echo json_encode($post);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Article non trouvé']);
                }
            } else {
                $query = "
                    SELECT 
                        p.id,
                        p.title,
                        p.slug,
                        p.content,
                        p.excerpt,
                        p.image_url,
                        c.name AS category,
                        p.author,
                        p.published_at,
                        DATE_FORMAT(p.published_at, '%d/%m/%Y') AS formatted_date
                    FROM posts p
                    LEFT JOIN categories c ON p.category = c.id
                    ORDER BY p.published_at DESC
                ";
                $stmt = $conn->query($query);
                $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($posts);
            }
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit();
            }

            $stmt = $conn->prepare("DELETE FROM posts WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Article supprimé avec succès']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Article non trouvé']);
            }
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID manquant']);
                exit();
            }

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Données invalides']);
                exit();
            }

            // Récupérer la catégorie actuelle si aucune nouvelle catégorie n'est fournie
            $stmt = $conn->prepare("SELECT category FROM posts WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $currentPost = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$currentPost) {
                http_response_code(404);
                echo json_encode(['error' => 'Article non trouvé']);
                exit();
            }

            // Utiliser la catégorie envoyée ou garder l'ancienne si absente
            $category = isset($data['category']) && $data['category'] !== null ? $data['category'] : $currentPost['category'];

            $stmt = $conn->prepare("
                UPDATE posts SET 
                    title = :title,
                    slug = :slug,
                    content = :content,
                    excerpt = :excerpt,
                    author = :author,
                    category = :category,
                    published_at = :published_at
                WHERE id = :id
            ");

            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));

            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':slug', $slug);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':excerpt', $data['excerpt']);
            $stmt->bindParam(':author', $data['author']);
            $stmt->bindParam(':category', $category, PDO::PARAM_INT);
            $stmt->bindParam(':published_at', $data['published_at']);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => 'Article mis à jour avec succès']);
            } else {
                echo json_encode(['message' => 'Aucune modification détectée']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur de base de données',
        'message' => $e->getMessage()
    ]);
}
