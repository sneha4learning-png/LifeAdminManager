const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const sendReminderEmail = require('./reminderEmail');

const DATA_FILE = path.join(__dirname, '../../local_vault.json');

// Persistence helper for the daily scheduler
const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) return { documents: [] };
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return { 
      documents: data.documents || [],
      users: data.users || {}
    };
  } catch (e) { return { documents: [] }; }
};

/**
 * Scheduled task that runs daily to check for documents nearing expiry.
 * It sends real emails via Resend to the user's registration address.
 */
const scheduleReminders = () => {
  // Run daily at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Life Admin Manager] Running daily expiry scan...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { documents, users } = loadData();

      for (const doc of documents) {
        // Find the owner by ID from the users object
        const userObj = Object.values(users).find(u => u._id === doc.userId) || Object.values(users)[0];
        const userEmail = userObj?.email;
        if (!userEmail) continue;

        const expDate = new Date(doc.expiryDate);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Trigger reminder if it matches the user-defined threshold
        if (diffDays === (doc.reminderDaysBefore || 7)) {
          console.log(`[Scheduler] Dispatching real reminder for "${doc.name}" to ${userEmail}`);
          await sendReminderEmail(userEmail, doc, userObj?.name || 'Valued Member');
        }
      }
    } catch (error) {
      console.error('[Critical] Master scheduler failed:', error.message);
    }
  });
};

module.exports = scheduleReminders;
