const sendMail = require('./mailSender');

/**
 * Specifically format and send a reminder email to a registered user.
 * Uses the user's registration email for dispatch.
 */
const sendReminderEmail = async (userEmail, document, userName = 'Valued Member') => {
  const subject = `🛡️ Security Alert: Action Required for ${document.name}`;
  
  const dashboardLink = process.env.CLIENT_URL || 'https://life-admin-manager-97c01.web.app';
  const expiryDateString = new Date(document.expiryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedName = userName.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background-color: #f0fdfa; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(20, 184, 166, 0.1); border: 1px solid #ccfbf1; }
        .header { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 45px 30px; text-align: center; color: white; }
        .header-logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 5px; }
        .header-tagline { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; opacity: 0.8; }
        .content { padding: 40px; color: #374151; line-height: 1.6; }
        .greeting { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 10px; }
        .accent-text { color: #14B8A6; }
        .doc-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0; }
        .status-pill { display: inline-block; padding: 5px 12px; background-color: #ffe4e6; color: #f43f5e; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .data-label { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .data-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .data-value.expiry { color: #f43f5e; }
        .cta-container { text-align: center; margin-top: 35px; }
        .cta-button { display: inline-block; background-color: #14B8A6; color: white !important; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4); }
        .footer { padding: 30px; text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9; }
        .footer p { margin: 5px 0; }
        .security-note { font-size: 12px; color: #64748b; margin-top: 25px; padding: 15px; border-radius: 8px; background-color: #fff7ed; border: 1px dashed #fdba74; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-logo">Life Admin Project</div>
          <div class="header-tagline">Master Secure Vault</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello <span class="accent-text">${formattedName}</span>,</div>
          <p>Our security system has analyzed your vault and identified a document that requires your immediate attention to maintain compliance and availability.</p>
          
          <div class="doc-card">
            <div class="status-pill">Action Required</div>
            
            <div class="data-row">
              <span class="data-label">Document</span>
              <span class="data-value">${document.name}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Category</span>
              <span class="data-value">${document.category}</span>
            </div>
            <div class="data-row" style="border-bottom: none;">
              <span class="data-label">Expiry Date</span>
              <span class="data-value expiry">${expiryDateString}</span>
            </div>
          </div>
          
          <p>To avoid any disruption or potential renewal delays, we recommend reviewing this document and initiating the renewal process if applicable.</p>
          
          <div class="cta-container">
            <a href="${dashboardLink}" class="cta-button">Access Secure Vault</a>
          </div>

          <div class="security-note">
            <strong>🔒 Security Protection:</strong> Your document details remain encrypted. This notification has been sent via your automated private relay.
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Life Admin Project • Secure Infrastructure</p>
          <p>This message was intended for ${userEmail}.</p>
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
