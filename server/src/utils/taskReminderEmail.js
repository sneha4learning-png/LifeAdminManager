const sendMail = require('./mailSender');

const sendTaskReminderEmail = async (userEmail, task, userName = 'Valued Member') => {
  const subject = `📌 Reminder: ${task.title}`;
  const dashboardLink = 'https://life-admin-manager-97c01.web.app/';
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color: #f0fdfa; padding: 20px; font-family: sans-serif; margin: 0;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ccfbf1;">
        <tr>
          <td align="center" style="background: #14B8A6; padding: 30px;">
            <div style="font-size: 20px; font-weight: 800; color: #ffffff;">Life Admin Reminder</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; color: #374151; line-height: 1.6;">
            <div style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 10px;">Hello ${userName},</div>
            <p>This is a friendly reminder for your task:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${task.title}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Priority: ${task.priority || 'NORMAL'}</div>
            </div>
            <p>Please check your dashboard for more details.</p>
            <div align="center" style="margin-top: 30px;">
              <a href="${dashboardLink}" style="background-color: #14B8A6; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">View Dashboard</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p>© ${new Date().getFullYear()} Life Admin Project</p>
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
