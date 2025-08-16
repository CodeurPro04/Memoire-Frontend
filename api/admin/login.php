<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// Connexion à la base
try {
    $pdo = new PDO("mysql:host=localhost;dbname=u125964618_consulting;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données']);
    exit;
}

// Lecture du corps JSON
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Debug temporaire
// file_put_contents("debug.txt", print_r($raw, true));

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Vérifie si les champs sont présents
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Champs requis manquants']);
    exit;
}

// Recherche dans la base
$stmt = $pdo->prepare("SELECT * FROM admins WHERE email = :email LIMIT 1");
$stmt->execute(['email' => $email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin && password_verify($password, $admin['password'])) {
    $token = bin2hex(random_bytes(32));
    echo json_encode([
        'token' => $token,
        'admin_id' => $admin['id'],
        'email' => $admin['email']
    ]);
    http_response_code(200);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Email ou mot de passe incorrect']);
}
