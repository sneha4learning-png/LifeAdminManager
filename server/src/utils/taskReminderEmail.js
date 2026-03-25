const sendMail = require('./mailSender');

const sendTaskReminderEmail = async (userEmail, task, userName = 'Valued Member') => {
  const subject = `📌 Reminder Support: Action Needed for "${task.title}"`;
  const dashboardLink = 'https://life-admin-manager-97c01.web.app/';
  const uniqueId = `TR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

  const formattedName = userName.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color: #f8fafc; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0;">
      <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: #f8fafc;">
        Vault Reminder: your task "${task.title}" requires attention.
      </div>

      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Top Branding -->
        <tr>
          <td align="center" style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 40px 30px;">
            <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Life Admin Manager</div>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.8); margin-top: 5px;">Secure Reminders Protocol</div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 40px; color: #334155; line-height: 1.7;">
            <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Hello <span style="color: #14B8A6;">${formattedName}</span>,</div>
            
            <p style="font-size: 15px; margin-bottom: 25px;">This is a system-generated reminder for a task that requires your personal attention. Maintaining your life admin in our vault ensures nothing falls through the cracks.</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; border-radius: 12px; border-left: 4px solid #14B8A6; margin-bottom: 30px;">
              <tr>
                <td style="padding: 24px;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Active Requirement</div>
                  <div style="font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">${task.title}</div>
                  <div style="margin-top: 15px; display: inline-block; padding: 4px 10px; border-radius: 4px; background: rgba(20, 184, 166, 0.1); color: #0d9488; font-size: 11px; font-weight: 700;">
                    PRIORITY: ${task.priority || 'NORMAL'}
                  </div>
                </td>
              </tr>
            </table>

            <p style="font-size: 14px; color: #64748b;">If this has already been completed, please access your dashboard to mark it as resolved.</p>

            <!-- CTA -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 35px;">
              <tr>
                <td align="center">
                  <a href="${dashboardLink}" style="background-color: #14B8A6; color: #ffffff; text-decoration: none; padding: 16px 35px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(20, 184, 166, 0.2);">Manage My Vault</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Security Footer -->
        <tr>
          <td style="padding: 30px; text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p style="margin-bottom: 5px;">🛡️ Safe-Access ID: <span style="color: #64748b; font-weight: 600;">${uniqueId}</span></p>
            <p>© ${new Date().getFullYear()} Life Admin Manager • Your Private Data Manager</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return await sendMail({
    to: userEmail,
    subject: subject,
    html: html
  });
};

module.exports = sendTaskReminderEmail;
