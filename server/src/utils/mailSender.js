const { Resend } = require('resend');
const nodemailer = require('nodemailer');

/**
 * Enhanced mail sender that uses the OFFICIAL RESEND SDK.
 * This is the ultimate fix for the "Privacy Error" and "Clipping" issues.
 */
const sendMail = async ({ to, subject, html }) => {
  try {
    // 🛡️ SOLUTION A: Official Resend SDK (Primary)
    if (process.env.RESEND_API_KEY) {
      console.log('[Life Admin Project] Dispatching via Official Resend SDK...');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'Life Admin Project <onboarding@resend.dev>',
        to: [to],
        subject: `🔔 [NEW] ${subject}`, // Marked as NEW to avoid Gmail clipping
        html: html,
        headers: {
          'X-Entity-Ref-ID': `${Date.now()}`,
          'X-Click-Tracking': 'false' 
        }
      });

      if (error) {
        console.error('[Resend Error Callback]:', error.message);
        throw new Error(error.message);
      }

      console.log(`[Resend SDK] Dispatch successful:`, data.id);
      return { success: true };
    }

    // 🛡️ SOLUTION B: Traditional SMTP Fallback
    console.log('[Life Admin Project] Falling back to SMTP...');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    const info = await transporter.sendMail({
      from: `"Life Admin Project" <${process.env.EMAIL_USER}>`,
      to, 
      subject: `🔔 [NEW] ${subject}`,
      html
    });

    console.log(`[SMTP] Success:`, info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Master Mailer Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;
