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
    console.log('[Life Admin Project] Running daily automated expiry sweep...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const documents = await Document.find({ 
        expiryDate: { $gt: today } 
      });

      for (const doc of documents) {
        const user = await User.findById(doc.userId);
        if (!user) continue;

        const expDate = new Date(doc.expiryDate);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        /**
         * Logic:
         * 1. Send if document is exactly 3 days away (Standardized reminder)
         * 2. Send if it matches the user's specific custom threshold (if set)
         */
        if (diffDays === 3 || diffDays === doc.reminderDaysBefore) {
          console.log(`[Scheduler] Dispatching automated alert for "${doc.name}" to ${user.email}`);
          await sendReminderEmail(user.email, doc, user.name);
        }
      }
    } catch (error) {
      console.error('[Critical] Life Admin Project Scheduler failure:', error.message);
    }
  });
};

module.exports = scheduleReminders;

