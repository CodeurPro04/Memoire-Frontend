<?php
// api/realisations.php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("
    SELECT 
        projects.id, 
        projects.title, 
        projects.subtitle, 
        projects.image_url, 
        categories.name AS category_name,  -- on récupère le nom de la catégorie
        projects.slug, 
        projects.created_at
    FROM projects
    LEFT JOIN categories ON projects.category = categories.id
");

    $stmt->execute();
    $realisations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $realisations
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de connexion: ' . $e->getMessage()
    ]);
}
