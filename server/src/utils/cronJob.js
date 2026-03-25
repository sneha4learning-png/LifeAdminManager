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
        expiryDate: { $gt: today },
        completed: false
      });

      for (const doc of documents) {
        const user = await User.findById(doc.userId);
        if (!user) continue;

        const expDate = new Date(doc.expiryDate);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        /**
         * Enhanced Proactive Multi-Stage Logic:
         * 1. Critical Window (Final 3 days): Fire EVERY morning at 08:00 AM.
         * 2. Milestone Reminder (User Custom Threshold): Fire once when reached.
         */
        const isCriticalWindow = diffDays <= 3 && diffDays > 0;
        const reachedMilestone = diffDays === doc.reminderDaysBefore;

        // Fire if within critical window OR if it's the milestone day and milestone hasn't been sent.
        if (isCriticalWindow || (reachedMilestone && !doc.reminderSent)) {
          console.log(`[Scheduler] Dispatching Vault Alert for "${doc.name}" to ${user.email} (${diffDays} days remaining)`);
          
          const recipient = user.targetEmail || user.email;
          const result = await sendReminderEmail(recipient, doc, user.name);
          
          // Mark milestone as sent to prevent multiple triggers for distant dates
          if (result.success && reachedMilestone) {
            doc.reminderSent = true;
            await doc.save();
          }
        }
      }
    } catch (error) {
      console.error('[Critical] Life Admin Project Scheduler failure:', error.message);
    }
  });
};

module.exports = scheduleReminders;

