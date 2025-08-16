<?php
// En-têtes CORS améliorés
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre immédiatement aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration de la base de données
$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

// Fonction pour envoyer les réponses JSON
function sendJsonResponse($success, $message = '', $data = []) {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8mb4");

    // Vérification du slug
    if (!isset($_GET['slug']) || empty($_GET['slug'])) {
        sendJsonResponse(false, "Le paramètre 'slug' est requis");
    }
    
    $slug = $_GET['slug'];

    // Requête pour l'article principal
    $stmt = $conn->prepare("SELECT posts.*, categories.name AS category_name 
                           FROM posts 
                           LEFT JOIN categories ON posts.category = categories.id 
                           WHERE posts.slug = :slug LIMIT 1");
    $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmt->execute();
    
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        sendJsonResponse(false, "Article non trouvé");
    }

    // Requête pour les articles similaires
    $relatedStmt = $conn->prepare("SELECT posts.id, posts.title, posts.slug, posts.excerpt, 
                                  posts.image_url, posts.created_at, categories.name AS category_name
                                  FROM posts 
                                  LEFT JOIN categories ON posts.category = categories.id 
                                  WHERE posts.category = :category_id AND posts.id != :post_id
                                  ORDER BY RAND() LIMIT 3");
    
    $relatedStmt->bindParam(':category_id', $post['category'], PDO::PARAM_INT);
    $relatedStmt->bindParam(':post_id', $post['id'], PDO::PARAM_INT);
    $relatedStmt->execute();
    
    $relatedPosts = $relatedStmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatage de la réponse
    $response = [
        'id' => $post['id'],
        'title' => $post['title'],
        'content' => $post['content'],
        'excerpt' => $post['excerpt'],
        'image_url' => $post['image_url'],
        'published_at' => $post['created_at'],
        'category_id' => $post['category'],
        'category_name' => $post['category_name'],
        'author' => $post['author'] ?? 'KOF-GO Consulting',
        'slug' => $post['slug'],
        'related_posts' => $relatedPosts
    ];

    sendJsonResponse(true, '', $response);

} catch(PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendJsonResponse(false, "Erreur de base de données");
} catch(Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendJsonResponse(false, $e->getMessage());
}