<?php
// list.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Connexion à la base de données (MySQLi)
$mysqli = new mysqli('127.0.0.1:3306', 'u125964618_kofgo', 'KofGo@2023', 'u125964618_consulting');

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit;
}

// Requête pour récupérer tous les admins
$result = $mysqli->query("SELECT id, email FROM admins ORDER BY id ASC");

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des administrateurs']);
    exit;
}

$admins = [];
while ($row = $result->fetch_assoc()) {
    $admins[] = $row;
}

echo json_encode($admins);
$mysqli->close();
