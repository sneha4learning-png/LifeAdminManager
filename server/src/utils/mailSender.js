const nodemailer = require('nodemailer');
const axios = require('axios');

/**
 * Enhanced mail sender that supports both SMTP and Resend API.
 * This is the "Another Solution" for more reliable delivery.
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    // SOLUTION A: Resend API (Priority if API Key is present)
    if (process.env.RESEND_API_KEY) {
      console.log('[Life Admin Project] Attempting dispatch via Resend API...');
      const response = await axios.post('https://api.resend.com/emails', {
        from: `Life Admin Project <onboarding@resend.dev>`,
        to: [to],
        subject: subject,
        html: html,
        // Disable click tracking to avoid the Chrome "Privacy Error"
        tracking_settings: {
          click: {
            enable: false
          }
        },
        // Prevent Gmail from "clipping" content by making every email unique
        headers: {
          'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          'List-Unsubscribe': `<mailto:unsubscribe@life-admin-manager.com>`
        }
      }, {
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` }
      });
      console.log(`[Resend API] Dispatch successful for ${to}:`, response.data.id);
      return { success: true };
    }

    // SOLUTION B: Traditional SMTP (Gmail/Outlook Fallback)
    console.log('[Life Admin Manager] Falling back to SMTP relay...');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"Life Admin Manager" <${process.env.EMAIL_USER}>`,
      to, 
      subject, 
      html
    });

    console.log(`[SMTP] Email sent to ${to}:`, info.messageId);
    return { success: true };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error('Master Mailer Critical Error:', errorMsg);
    return { success: false, error: errorMsg };
  }
};

module.exports = sendMail;
