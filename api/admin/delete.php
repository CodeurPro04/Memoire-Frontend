<?php
// delete.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Gérer la requête préliminaire (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connexion à la base de données
$mysqli = new mysqli('127.0.0.1:3306', 'u125964618_kofgo', 'KofGo@2023', 'u125964618_consulting');

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données']);
    exit;
}

// Lecture des données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !is_numeric($data['id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'ID invalide ou manquant']);
    exit;
}

$id = (int)$data['id'];

// Supprimer l'administrateur
$stmt = $mysqli->prepare("DELETE FROM admins WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['message' => 'Administrateur supprimé avec succès']);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Administrateur non trouvé']);
    }
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur lors de la suppression']);
}

$stmt->close();
$mysqli->close();
