<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = $_POST['title'] ?? '';
        $subtitle = $_POST['subtitle'] ?? '';
        $category = $_POST['category'] ?? '';

        // Slug automatique
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));

        // Upload image
        $image_url = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../uploads/';
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

        // Insert DB
        $stmt = $conn->prepare("INSERT INTO projects (title, subtitle, category, slug, image_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$title, $subtitle, $category, $slug, $image_url]);

        echo json_encode(['success' => true, 'message' => 'Réalisation ajoutée avec succès']);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur', 'message' => $e->getMessage()]);
}
