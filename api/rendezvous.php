<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // PHPMailer
require 'config.php'; // Connexion PDO

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Récupération des données JSON
$input = json_decode(file_get_contents("php://input"), true);

if (
    empty($input['name']) ||
    empty($input['email']) ||
    empty($input['phone']) ||
    empty($input['date']) ||
    empty($input['time'])
) {
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs requis n'ont pas été fournis.",
    ]);
    exit;
}

// Sécurisation
$name = trim($input['name']);
$email = trim($input['email']);
$phone = trim($input['phone']);
$date = trim($input['date']);
$time = trim($input['time']);
$message = !empty($input['message']) ? trim($input['message']) : "Aucun message fourni.";

try {
    // Enregistrement en BDD
    $stmt = $pdo->prepare("INSERT INTO appointments (name, email, phone, date, time, message) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $date, $time, $message]);

    // Construction de l'email HTML
    $htmlBody = '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Nouveau rendez-vous</title>
</head>
<body style="margin:0; padding:0; font-family:\'Segoe UI\', sans-serif; background-color:#f2f4f8;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; margin:40px auto; background-color:#ffffff; border-radius:10px; box-shadow:0 0 15px rgba(0,0,0,0.05); overflow:hidden;">
    <tr style="background-color:#0a0f3d;">
      <td style="padding:30px; text-align:center;">
        <img src="https://kofgo-consulting.com/assets/img/logokofgo.jpg" alt="Logo KOF-GO CONSULTING" style="width:120px; margin-bottom:10px;">
        <h1 style="color:#ffffff; font-size:22px; margin:0;">📅 Nouveau rendez-vous pris</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr><td style="font-weight:600;">👤 Nom & Prénom :</td><td>' . htmlspecialchars($name) . '</td></tr>
          <tr><td style="font-weight:600;">📧 Email :</td><td>' . htmlspecialchars($email) . '</td></tr>
          <tr><td style="font-weight:600;">📞 Téléphone :</td><td>' . htmlspecialchars($phone) . '</td></tr>
          <tr><td style="font-weight:600;">📆 Date :</td><td>' . htmlspecialchars($date) . '</td></tr>
          <tr><td style="font-weight:600;">⏰ Heure :</td><td>' . htmlspecialchars($time) . '</td></tr>
          <tr><td style="font-weight:600;">💬 Message :</td><td>' . ($message ?: "Aucun message") . '</td></tr>
        </table>
      </td>
    </tr>
    <tr style="background-color:#f5f6fa;">
      <td align="center" style="padding:20px;">
        <p style="font-size:14px; color:#555;">Répondre au client ?</p>
        <a href="mailto:' . htmlspecialchars($email) . '" style="display:inline-block; background-color:#0a0f3d; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:6px; margin-top:10px; font-size:14px;">📩 Répondre à ' . htmlspecialchars($name) . '</a>
        <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
        <p style="font-size:12px; color:#888;">&copy; ' . date("Y") . ' <a href="https://kofgo-consulting.com" style="color:#888; text-decoration:none;">KOF-GO CONSULTING</a> - Tous droits réservés.</p>
      </td>
    </tr>
  </table>
</body>
</html>';

    // Envoi email avec PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'innocent.koffi@kofgo-consulting.com';
    $mail->Password   = 'Moussa@12@'; // 🔐 Idéalement dans une variable d'environnement
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('innocent.koffi@kofgo-consulting.com', 'KOF-GO CONSULTING');
    $mail->addAddress('innocent.koffi@kofgo-consulting.com');
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "📆 Nouveau rendez-vous par $name";
    $mail->Body    = $htmlBody;

    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "Rendez-vous enregistré et email envoyé."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'envoi de l'email : " . $mail->ErrorInfo
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur en base de données : " . $e->getMessage()
    ]);
}
