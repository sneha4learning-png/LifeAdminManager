const { Resend } = require('resend');

const sendTaskReminderEmail = async (userEmail, task, userName = 'Valued Member') => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dashboardLink = 'https://life-admin-manager-97c01.web.app/tasks';
  const dueDateString = new Date(task.dueDate).toLocaleDateString();

  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #14B8A6;">Task Reminder: ${task.title}</h2>
      <p>Hello ${userName},</p>
      <p>This is a reminder for your task: <strong>${task.title}</strong></p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #F43F5E;">
        <p><strong>Due Date:</strong> ${dueDateString}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Category:</strong> ${task.category}</p>
      </div>
      <p style="margin-top: 20px;">
        <a href="${dashboardLink}" style="background: #14B8A6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View My Task List</a>
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
