const sendMail = require('./mailSender');

/**
 * Specifically format and send a reminder email to a registered user.
 * Uses the user's registration email for dispatch.
 */
const sendReminderEmail = async (userEmail, document, userName = 'Valued Member') => {
  const subject = `🛡️ Urgent: Action Required for ${document.name} Renewal`;
  
  const dashboardLink = process.env.CLIENT_URL || 'http://localhost:5173';
  const expiryDateString = new Date(document.expiryDate).toDateString();
  
  // Format user name for greeting
  const formattedName = userName.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0062FF 0%, #0045B5 100%); padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 40px; color: #333333; line-height: 1.6; }
        .doc-table { width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #f8faff; border-radius: 8px; overflow: hidden; }
        .doc-table td { padding: 15px; border-bottom: 1px solid #e1e8f5; }
        .doc-table td.label { font-weight: bold; color: #666; width: 35%; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .doc-table td.value { color: #111; font-weight: 500; }
        .id-badge { display: inline-block; padding: 2px 8px; background-color: #eee; border-radius: 4px; font-family: monospace; font-size: 11px; color: #666; margin-bottom: 10px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; background-color: #FFEBEB; color: #EF4444; margin-bottom: 15px; }
        .cta-button { display: inline-block; background-color: #0062FF; color: white !important; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; margin-top: 10px; }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #888888; background-color: #fdfdfd; border-top: 1px solid #eeeeee; }
        .security-tip { font-size: 13px; color: #666; background-color: #fff9db; padding: 15px; border-radius: 6px; margin-top: 25px; border: 1px dashed #fab005; }
      </style>
    </head>
    <body style="background-color: #f4f7f9; padding: 20px;">
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: -1px;">Life Admin Manager</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-weight: 500;">Secure Vault Notification</p>
        </div>
        
        <div class="content">
          <h2 style="color: #111; margin-top: 0; font-size: 22px;">Security Renewal Alert</h2>
          <p>Hello <strong style="color: #0062FF;">${formattedName}</strong>,</p>
          <p>Our automated lifecycle monitoring system has identified a key record in your vault that requires renewal to maintain compliance and security.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 25px;">
            <div class="id-badge">Reference ID: ${document._id || 'N/A'}</div><br/>
            <span class="status-badge">Requires Attention</span>
            
            <table class="doc-table">
              <tr>
                <td class="label" style="padding-right: 20px; white-space: nowrap; min-width: 140px;">Document Label</td>
                <td class="value">${document.name.charAt(0).toUpperCase() + document.name.slice(1).toLowerCase()}</td>
              </tr>
              <tr>
                <td class="label" style="padding-right: 20px; white-space: nowrap; min-width: 140px;">Category</td>
                <td class="value">${document.category === 'ID' ? 'Identity Card / Passport' : (document.category || 'Personal Document')}</td>
              </tr>
              <tr>
                <td class="label" style="padding-right: 20px; white-space: nowrap; min-width: 140px;">Expiry Date</td>
                <td class="value" style="color: #EF4444; font-weight: bold;">${expiryDateString}</td>
              </tr>
              ${document.notes ? `<tr><td class="label" style="padding-right: 20px; min-width: 140px;">User Notes</td><td class="value" style="font-style: italic;">${document.notes}</td></tr>` : ''}
            </table>
          </div>
          
          <p>To ensure continuity and maintain vault accuracy, please log in and update this record at your earliest convenience.</p>
          
          <div style="text-align: center; margin-top: 10px;">
            <a href="${dashboardLink}" class="cta-button" target="_blank">Access My Vault</a>
            <p style="margin-top: 20px; font-size: 11px; color: #999;">
              If the button doesn't work, copy-paste this URL into your browser:<br/>
              <span style="color: #0062FF;">${dashboardLink}</span>
            </p>
          </div>

          <div class="security-tip">
            <strong>🔒 Verification Tip:</strong> Always verify that you are on <u>${dashboardLink}</u> before entering your vault credentials.
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Antigravity Life Admin Manager</p>
          <p style="margin-top: 5px;">Secure document storage and lifecycle management.</p>
        </div>
      </div>
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
