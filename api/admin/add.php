<?php
// add.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ⚠️ Gérer la requête préliminaire (CORS)
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

// Lecture des données JSON envoyées en POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Champs requis manquants']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

// Validation simple de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email invalide']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['message' => 'Le mot de passe doit contenir au moins 6 caractères']);
    exit;
}

// Vérifier si l'email existe déjà
$stmt = $mysqli->prepare("SELECT id FROM admins WHERE email = ?");
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409); // Conflit
    echo json_encode(['message' => 'Un administrateur avec cet email existe déjà']);
    $stmt->close();
    $mysqli->close();
    exit;
}
$stmt->close();

// Hasher le mot de passe
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insérer le nouvel admin
$stmt = $mysqli->prepare("INSERT INTO admins (email, password) VALUES (?, ?)");
$stmt->bind_param('ss', $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Administrateur ajouté avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur lors de l\'ajout de l\'administrateur']);
}

$stmt->close();
$mysqli->close();
