export function generateAuditReminderHtml(skillName: string, auditDate: string, userName?: string): string {
	const escapeHtml = (str: string) =>
		str.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	
	const greeting = userName ? `${escapeHtml(userName)}, здравствуйте!` : 'Здравствуйте!';
	
	return `
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Напоминание об аудите навыка</title>
</head>
<body style="margin:0;background:#f6f7fb;padding:20px;font-family:Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="margin:0;font-size:24px;color:#111;font-weight:700;">
            <span style="color:#2563eb;">Palma</span> SkillMatrix
          </h1>
        </div>
        
        <h2 style="margin:0 0 16px 0;font-size:20px;color:#111;">Напоминание об аудите навыка</h2>
        
        <p style="margin:0 0 16px 0;color:#374151;line-height:1.5;">
          ${greeting}
        </p>
        
        <p style="margin:0 0 20px 0;color:#374151;line-height:1.5;">
          Напоминаем, что аудит навыка <strong>${escapeHtml(skillName)}</strong> запланирован до <strong>${escapeHtml(auditDate)}</strong>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}
