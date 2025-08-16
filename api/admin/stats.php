<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration de la base de données
$servername = "127.0.0.1:3306";
$username = "u125964618_kofgo";
$password = "KofGo@2023";
$dbname = "u125964618_consulting";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");

    // Récupération du nombre de réalisations
    $stmt = $conn->query("SELECT COUNT(*) as count FROM projects");
    $realisations = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Récupération du nombre de rendez-vous
    $stmt = $conn->query("SELECT COUNT(*) as count FROM appointments");
    $appointments = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Récupération du nombre de projets clients
    $stmt = $conn->query("SELECT COUNT(*) as count FROM project_ideas");
    $projects = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Récupération du nombre d'articles de blog
    $stmt = $conn->query("SELECT COUNT(*) as count FROM posts");
    $blogPosts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Requêtes groupées (préparées pour éviter plusieurs appels)
    $queries = [
        'realisations' => "SELECT COUNT(*) as count FROM projects",
        'appointments' => "SELECT COUNT(*) as count FROM appointments",
        'projects' => "SELECT COUNT(*) as count FROM project_ideas",
        'blogPosts' => "SELECT COUNT(*) as count FROM posts"
    ];

    $results = [];

    foreach ($queries as $key => $sql) {
        $stmt = $conn->query($sql);
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        $results[$key] = [
            'count' => intval($count),
            'change' => "+" . rand(1, 15) . "%"  // Simule un changement aléatoire
        ];
    }

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur de base de données',
        'message' => $e->getMessage()
    ]);
}
?>


