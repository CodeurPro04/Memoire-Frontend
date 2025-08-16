<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vérification du paramètre slug
    if (!isset($_GET['slug']) || empty($_GET['slug'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Aucun slug fourni'
        ]);
        exit;
    }

    $slug = $_GET['slug'];

    $stmt = $conn->prepare("
        SELECT 
            posts.*, 
            categories.name AS category_name 
        FROM posts 
        LEFT JOIN categories ON posts.category = categories.id 
        WHERE posts.slug = :slug
        LIMIT 1
    ");
    $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmt->execute();

    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        echo json_encode([
            'success' => true,
            'data' => $post
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Article non trouvé'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de connexion : ' . $e->getMessage()
    ]);
}
