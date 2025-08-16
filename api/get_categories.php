<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Paramètres de connexion
$host = '127.0.0.1:3306';
$dbname = 'u125964618_consulting'; // à remplacer par le vrai nom de ta BDD
$username = 'u125964618_kofgo';         // à remplacer par ton nom d'utilisateur
$password = 'KofGo@2023';          // <-- remplace par ton mot de passe MySQL

try {
    // Connexion PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Requête SQL
    $stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Réponse JSON
    echo json_encode([
        'success' => true,
        'categories' => $categories
    ]);
} catch (PDOException $e) {
    // Erreur
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de connexion ou de requête : ' . $e->getMessage()
    ]);
}

