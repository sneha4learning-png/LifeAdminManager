const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const sendTaskEmail = require('./taskReminderEmail');

/**
 * High-precision task monitor that runs every minute to fire off 
 * scheduled reminders exactly when their dueTime matches.
 */
const startTaskScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentDay = new Date();
      currentDay.setHours(0, 0, 0, 0);

      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');

      // Find tasks due today (or earlier) that haven't been notified yet
      const tasks = await Task.find({
        completed: false,
        reminderSent: false,
        dueDate: { $lte: now } // Simple check for date
      });

      for (const task of tasks) {
        // Only fire if the time has passed today, or if the due date was in the past
        const isPastDay = new Date(task.dueDate) < currentDay;
        const isExactTime = task.dueTime <= currentTime;

        if (isPastDay || isExactTime) {
          const user = await User.findById(task.userId);
          if (user) {
            console.log(`[Task Scheduler] Firing precision reminder: "${task.title}" for ${user.email} at ${currentTime}`);
            await sendTaskEmail(user.email, task, user.name);
            
            task.reminderSent = true;
            await task.save();
          }
        }
      }
    } catch (error) {
      console.error('[Task Scheduler Error]:', error.message);
    }
  });
};

module.exports = startTaskScheduler;
