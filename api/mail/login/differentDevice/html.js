const different_device_mail_content = (username,enter_time,device,brand,ip,location,securty_link) => {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farklı Cihazdan Oturum Açıldı</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding: 10px 0;
        }
        .email-header h1 {
            color: #333;
        }
        .email-body {
            padding: 20px;
            color: #555;
            line-height: 1.6;
        }
        .email-body p {
            margin: 0 0 15px;
        }
        .email-body h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            color: #888;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #218838;
        }
        .info-box {
            background-color: #f9f9f9;
            padding: 10px;
            border-left: 4px solid #28a745;
            margin-bottom: 20px;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Farklı Bir Cihazdan Oturum Açtınız</h1>
        </div>
        <div class="email-body">
            <p>Merhaba <strong>${username}</strong>,</p>
            <p>Hesabınıza yeni bir cihazdan giriş yapıldı. Eğer bu giriş size aitse herhangi bir işlem yapmanıza gerek yok. Eğer girişin size ait olmadığını düşünüyorsanız, lütfen aşağıdaki adımları takip edin.</p>

            <h2>Giriş Bilgileri</h2>
            <div class="info-box">
                <p><strong>Giriş Zamanı:</strong> ${enter_time}</p>
                <p><strong>Cihaz:</strong> ${device}/${brand}</p>
                <p><strong>IP Adresi:</strong> ${ip}</p>
                <p><strong>Konum:</strong> ${location}</p>
            </div>

            <p>Eğer bu giriş size ait değilse, lütfen aşağıdaki bağlantıya tıklayarak hesabınızı güvende tutmak için oturumlarınızı kapatın ve şifrenizi sıfırlayın:</p>
            <p style="text-align: center;">
                <a href="${securty_link}" class="button">Oturumları Kapat ve Şifreyi Sıfırla</a>
            </p>
        </div>

        <div class="email-footer">
            <p>Şüpheli bir aktivite fark ederseniz, <a href="mailto:info@spotsoundmusic.com">destek ekibimizle</a> iletişime geçmekten çekinmeyin.</p>
            <p>Teşekkürler,<br>SpotSound Ekibi</p>
        </div>
    </div>
</body>
</html>`
}
module.exports = { different_device_mail_content }

/**
 * const different_device_mail_content = (username, enter_time, device, brand, ip, location, securty_link) => {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yeni Cihazdan Giriş Yapıldı</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                    <!-- Başlık -->
                    <tr>
                        <td align="center" style="padding: 10px 0; font-size: 24px; font-weight: bold; color: #333;">
                            Yeni Cihazdan Giriş Yapıldı
                        </td>
                    </tr>
                    <!-- İçerik -->
                    <tr>
                        <td style="padding: 20px; font-size: 16px; color: #555;">
                            <p>Merhaba <strong>${username}</strong>,</p>
                            <p>Hesabınıza yeni bir cihazdan giriş yapıldı. Eğer bu giriş size aitse herhangi bir işlem yapmanıza gerek yok. Eğer girişin size ait olmadığını düşünüyorsanız, lütfen aşağıdaki adımları takip edin.</p>
                            <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Giriş Bilgileri</h2>
                            <p><strong>Giriş Zamanı:</strong> ${enter_time}</p>
                            <p><strong>Cihaz:</strong> ${device} (${brand})</p>
                            <p><strong>IP Adresi:</strong> ${ip}</p>
                            <p><strong>Konum:</strong> ${location}</p>
                        </td>
                    </tr>
                    <!-- Buton -->
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <a href="${securty_link}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                Oturumları Kapat ve Şifreyi Sıfırla
                            </a>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 20px; font-size: 12px; color: #888;">
                            <p>Şüpheli bir aktivite fark ederseniz, <a href="mailto:support@your-app.com" style="color: #007bff; text-decoration: none;">destek ekibimizle</a> iletişime geçmekten çekinmeyin.</p>
                            <p>Teşekkürler,<br>[Uygulama Adı] Ekibi</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
 */