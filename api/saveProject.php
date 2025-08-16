<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Assure-toi que le chemin est correct

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "Données JSON invalides"]);
  exit;
}

// Récupérer et valider les données
$fullname = $data['fullname'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$objectif = $data['objectif'] ?? '';
$description = $data['description'] ?? '';
$besoin = $data['besoin'] ?? '';

if (!$fullname || !$email || !$phone || !$objectif || !$description || !$besoin) {
  echo json_encode(["success" => false, "message" => "Tous les champs sont obligatoires"]);
  exit;
}

// Connexion à la base
try {
  $pdo = new PDO("mysql:host=127.0.0.1:3306;dbname=u125964618_consulting", "u125964618_kofgo", "KofGo@2023", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  ]);

  $stmt = $pdo->prepare("INSERT INTO project_ideas (fullname, email, phone, objectif, description, besoin, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
  $stmt->execute([$fullname, $email, $phone, $objectif, $description, $besoin]);

  // Construction du contenu de l'email
  $htmlBody = '
  <!DOCTYPE html>
  <html lang="fr">
  <head><meta charset="UTF-8"><title>Nouvelle idée de projet</title></head>
  <body style="margin:0; padding:0; font-family:\'Segoe UI\', sans-serif; background-color:#f2f4f8;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; margin:40px auto; background-color:#ffffff; border-radius:10px; box-shadow:0 0 15px rgba(0,0,0,0.05); overflow:hidden;">
      <tr style="background-color:#0a0f3d;">
        <td style="padding:30px; text-align:center;">
          <img src="https://kofgo-consulting.com/assets/img/logokofgo.jpg" alt="Logo KOF-GO CONSULTING" style="width:120px; margin-bottom:10px;">
          <h1 style="color:#ffffff; font-size:22px; margin:0;">🚀 Nouvelle idée de projet soumise</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr><td style="font-weight:600;">👤 Nom & Prénom :</td><td>' . htmlspecialchars($fullname) . '</td></tr>
            <tr><td style="font-weight:600;">📧 Email :</td><td>' . htmlspecialchars($email) . '</td></tr>
            <tr><td style="font-weight:600;">📞 Téléphone :</td><td>' . htmlspecialchars($phone) . '</td></tr>
            <tr><td style="font-weight:600;">🎯 Objectif :</td><td>' . htmlspecialchars($objectif) . '</td></tr>
            <tr><td style="font-weight:600;">📝 Description :</td><td>' . nl2br(htmlspecialchars($description)) . '</td></tr>
            <tr><td style="font-weight:600;">📌 Besoin immédiat :</td><td>' . htmlspecialchars($besoin) . '</td></tr>
          </table>
        </td>
      </tr>
      <tr style="background-color:#f5f6fa;">
        <td align="center" style="padding:20px;">
          <p style="font-size:14px; color:#555;">Répondre à l\'auteur ?</p>
          <a href="mailto:' . htmlspecialchars($email) . '" style="display:inline-block; background-color:#0a0f3d; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:6px; margin-top:10px; font-size:14px;">📩 Répondre à ' . htmlspecialchars($fullname) . '</a>
          <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
          <p style="font-size:12px; color:#888;">&copy; ' . date("Y") . ' <a href="https://kofgo-consulting.com" style="color:#888; text-decoration:none;">KOF-GO CONSULTING</a> - Tous droits réservés.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>';

  // Envoi de l'email avec PHPMailer
  $mail = new PHPMailer(true);

  try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'innocent.koffi@kofgo-consulting.com';
    $mail->Password   = 'Moussa@12@'; // Remplace par une variable d'env
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;


    

    $mail->setFrom('innocent.koffi@kofgo-consulting.com', 'KOF-GO CONSULTING');
    $mail->addAddress('innocent.koffi@kofgo-consulting.com');
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = "📝 Nouvelle soumission de projet par $fullname";
    $mail->Body = $htmlBody;


    $mail->send();
    echo json_encode(["success" => true]);
  } catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Email non envoyé. Erreur : " . $mail->ErrorInfo]);
  }
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
