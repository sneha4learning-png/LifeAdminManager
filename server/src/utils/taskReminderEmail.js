const { Resend } = require('resend');

const sendTaskReminderEmail = async (userEmail, task, userName = 'Valued Member') => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const apiBase = 'https://lifeadminmanager.onrender.com/api/tasks';
  const dashboardLink = 'https://life-admin-manager-97c01.web.app/tasks';
  const dueDateString = new Date(task.dueDate).toLocaleDateString();

  const html = `
    <div style="font-family: -apple-system, sans-serif; padding: 25px; color: #334155; max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; padding-bottom: 20px;">
        <div style="font-size: 24px; font-weight: 800; color: #14B8A6;">Life Admin Project</div>
      </div>

      <h2 style="color: #111827; margin-bottom: 10px;">🕒 Action Required: ${task.title}</h2>
      <p>Hello ${userName}, this is your automated reminder for the following task.</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 5px solid #F43F5E; margin: 25px 0;">
        <p style="margin: 0;"><strong>Due Date:</strong> ${dueDateString}</p>
        <p style="margin: 5px 0;"><strong>Priority:</strong> ${task.priority}</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">One-Click Postpone</p>
        <div style="margin-top: 10px;">
           <a href="${apiBase}/${task._id}/reschedule/1" style="background: #14B8A6; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 5px;">+1 Day</a>
           <a href="${apiBase}/${task._id}/reschedule/3" style="background: #14B8A6; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 5px;">+3 Days</a>
           <a href="${apiBase}/${task._id}/reschedule/7" style="background: #14B8A6; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 5px;">+1 Week</a>
        </div>
      </div>

      <p style="margin-top: 40px; text-align: center;">
        <a href="${dashboardLink}" style="color: #14B8A6; font-weight: 700; text-decoration: none; border-bottom: 2px solid #14B8A6; padding-bottom: 2px;">View My Task List</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: 'Life Admin Project <onboarding@resend.dev>',
    to: [userEmail],
    subject: `🕒 Reminder: ${task.title}`,
    html: html
  });
};

module.exports = sendTaskReminderEmail;
