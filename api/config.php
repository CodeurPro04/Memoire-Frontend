<?php
// Configuration de la base de données
$host = 'localhost';
$dbname = 'u125964618_consulting'; // à remplacer par le vrai nom de ta BDD
$username = 'root';         // à remplacer par ton nom d'utilisateur
$password = '';            // à remplacer par ton mot de passe

try {
    // Connexion PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Définir le mode d'erreur PDO sur Exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Gestion des erreurs de connexion
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

