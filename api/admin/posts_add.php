<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // ✅ Cas 1 : GET → Récupérer les catégories
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->query("SELECT id, name FROM categories");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['categories' => $categories]);
        exit;
    }

    // ✅ Cas 2 : POST → Ajouter un article
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = $_POST['title'] ?? '';
        $excerpt = $_POST['excerpt'] ?? '';
        $content = $_POST['content'] ?? '';
        $category = $_POST['category'] ?? '';
        $author = $_POST['author'] ?? '';
        $published_at = $_POST['published_at'] ?? '';

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));

        // Upload image
        $image_url = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = __DIR__ . '/../../uploads/'; // ✅ Corrigé
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                $image_url = 'uploads/' . $fileName;
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Échec de l\'upload de l\'image']);
                exit;
            }
        }

        // Insertion
        $stmt = $conn->prepare("INSERT INTO posts (title, slug, excerpt, content, category, author, published_at, image_url)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $excerpt, $content, $category, $author, $published_at, $image_url]);

        echo json_encode(['success' => true, 'message' => 'Article ajouté avec succès']);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur', 'message' => $e->getMessage()]);
}
