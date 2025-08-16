<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("
    SELECT 
        posts.*, 
        categories.name AS category_name 
    FROM posts 
    LEFT JOIN categories ON posts.category = categories.id 
    ORDER BY RAND() 
");

    $stmt->execute();
    
    $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $blogs
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de connexion: ' . $e->getMessage()
    ]);
}
