<?php
// Configuration de la base de données
$host = '127.0.0.1:3306';
$dbname = 'u125964618_consulting'; // à remplacer par le vrai nom de ta BDD
$username = 'u125964618_kofgo';         // à remplacer par ton nom d'utilisateur
$password = 'KofGo@2023';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

// Données de l'administrateur
$email = 'admin@gmail.com';
$plainPassword = 'Password';

// Hash du mot de passe
$passwordHash = password_hash($plainPassword, PASSWORD_DEFAULT);

// Vérifie s'il existe déjà
$stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE email = ?");
$stmt->execute([$email]);
$exists = $stmt->fetchColumn();

if ($exists > 0) {
    echo "Un administrateur avec cet email existe déjà.";
} else {
    // Insertion dans la base
    $sql = "INSERT INTO admins (email, password, created_at) VALUES (:email, :password, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'email' => $email,
        'password' => $passwordHash
    ]);

    echo "Administrateur ajouté avec succès : $email / $plainPassword";
}
?>
