<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

if (!$name || !$email || !$subject || !$message) {
    echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'innocent.koffi@kofgo-consulting.com';
    $mail->Password   = 'Moussa@12@';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('innocent.koffi@kofgo-consulting.com', 'Message depuis Contact');
    $mail->addAddress('innocent.koffi@kofgo-consulting.com'); // Destinataire réel
    $mail->addReplyTo($email, $name); // Pour pouvoir répondre
    
    $mail->isHTML(true);
    $mail->Subject = "📩 Nouveau message de contact - Sujet : $subject";
    $mail->Body = '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Nouveau message de contact</title>
</head>
<body style="margin:0; padding:0; font-family:\'Segoe UI\', sans-serif; background-color:#f2f4f8;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; margin:40px auto; background-color:#ffffff; border-radius:10px; box-shadow:0 0 15px rgba(0,0,0,0.05); overflow:hidden;">
    
    <!-- En-tête -->
    <tr style="background-color:#0a0f3d;">
      <td style="padding:30px; text-align:center;">
        <img src="https://kofgo-consulting.com/kofgologo.png" alt="Logo KOF-GO CONSULTING" style="width:120px; margin-bottom:10px; background-color:white;">
        <h1 style="color:#ffffff; font-size:22px; margin:0;">📨 Nouveau message depuis contact</h1>
      </td>
    </tr>

    <!-- Contenu principal -->
    <tr>
  <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td width="30%" style="font-weight:600; vertical-align:top;">👤 Nom :</td>
        <td>' . htmlspecialchars($name) . '</td>
      </tr>
      <tr>
        <td width="30%" style="font-weight:600; vertical-align:top;">📧 Email :</td>
        <td>' . htmlspecialchars($email) . '</td>
      </tr>
      <tr>
        <td width="30%" style="font-weight:600; vertical-align:top;">📞 Téléphone :</td>
        <td>' . htmlspecialchars($phone) . '</td>
      </tr>
      <tr>
        <td width="30%" style="font-weight:600; vertical-align:top;">📝 Sujet :</td>
        <td>' . htmlspecialchars($subject) . '</td>
      </tr>
      <tr>
        <td width="30%" style="font-weight:600; vertical-align:top; padding-top:10px;">💬 Message :</td>
        <td style="padding-top:10px;">' . nl2br(htmlspecialchars($message)) . '</td>
      </tr>
    </table>
  </td>
</tr>
    <!-- Pied de page -->
    <tr style="background-color:#f5f6fa;">
      <td align="center" style="padding:20px;">
        <p style="font-size:14px; color:#555;">Besoin de répondre ? Cliquez ci-dessous :</p>
        <a href="mailto:' . htmlspecialchars($email) . '" style="display:inline-block; background-color:#0a0f3d; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:6px; margin-top:10px; font-size:14px;">📩 Répondre à ' . htmlspecialchars($name) . '</a>
        <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
        <p style="font-size:12px; color:#888;">&copy; ' . date("Y") . ' <a href="https://kofgo-consulting.com" style="color:#888; text-decoration:none;">KOF-GO CONSULTING</a> - Tous droits réservés.</p>
      </td>
    </tr>
    
  </table>
</body>
</html>';


    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur d\'envoi : ' . $mail->ErrorInfo]);
}
