const cron = require('node-cron');
const Document = require('../models/Document');
const User = require('../models/User');
const sendReminderEmail = require('./reminderEmail');

/**
 * Scheduled task that runs daily to check for documents nearing expiry.
 */
const scheduleReminders = () => {
  // Run daily at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Life Admin Manager] Running daily expiry scan...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const documents = await Document.find({ 
        expiryDate: { $gt: today } // Only check future expiries to avoid spam/redundancy
      });

      for (const doc of documents) {
        const user = await User.findById(doc.userId);
        if (!user) continue;

        const expDate = new Date(doc.expiryDate);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Trigger reminder if it matches the user-defined threshold
        if (diffDays === (doc.reminderDaysBefore || 7)) {
          console.log(`[Scheduler] Dispatching reminder for "${doc.name}" to ${user.email}`);
          await sendReminderEmail(user.email, doc, user.name);
        }
      }
    } catch (error) {
      console.error('[Critical] Master scheduler failed:', error.message);
    }
  });
};

module.exports = scheduleReminders;

