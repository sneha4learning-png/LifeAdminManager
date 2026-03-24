const sendMail = require('./mailSender');

/**
 * Specifically format and send a reminder email to a registered user.
 * Uses the user's registration email for dispatch.
 */
const sendReminderEmail = async (userEmail, document, userName = 'Valued Member') => {
  const subject = `🛡️ Security Alert: Action Required for ${document.name}`;
  
  const dashboardLink = 'https://life-admin-manager-97c01.web.app/';
  const expiryDateString = new Date(document.expiryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedName = userName.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color: #f0fdfa; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0;">
      <!-- Hidden unique preheader to prevent Gmail clipping -->
      <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: #f0fdfa;">
        Reference: ${uniqueId} - Critical Security Update for your Vault.
      </div>

      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ccfbf1;">
        <tr>
          <td align="center" style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 45px 30px;">
            <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 5px; color: #ffffff;">Life Admin Project</div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; opacity: 0.8; color: #ffffff;">Master Secure Vault</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px; color: #374151; line-height: 1.6;">
            <div style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 10px;">Hello <span style="color: #14B8A6;">${formattedName}</span>,</div>
            <p>Our security system has analyzed your vault and identified a document that requires your immediate attention to maintain compliance and availability.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 30px 0;">
              <div style="display: inline-block; padding: 5px 12px; background-color: #ffe4e6; color: #f43f5e; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Action Required</div>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 40%;">Document</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600; font-size: 14px; text-align: right;">${document.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Category</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600; font-size: 14px; text-align: right;">${document.category}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Expiry Date</td>
                  <td style="padding: 10px 0; color: #f43f5e; font-weight: 800; font-size: 14px; text-align: right;">${expiryDateString}</td>
                </tr>
              </table>
            </div>
            
            <p>To avoid any disruption or potential renewal delays, we recommend reviewing this document and initiating the renewal process if applicable.</p>
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 35px;">
              <tr>
                <td align="center">
                  <a href="${dashboardLink}" style="background-color: #14B8A6; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block;">Access Secure Vault</a>
                </td>
              </tr>
            </table>

            <div style="font-size: 12px; color: #64748b; margin-top: 40px; padding: 15px; border-radius: 8px; background-color: #fff7ed; border: 1px dashed #fdba74; text-align: center;">
              <strong>🔒 Security Protection:</strong> Your document details remain encrypted. Reference ID: ${uniqueId}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p>© ${new Date().getFullYear()} Life Admin Project • Secure Infrastructure</p>
            <p>This message was intended for ${userEmail}.</p>
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

module.exports = sendReminderEmail;
