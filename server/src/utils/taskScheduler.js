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
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');

      console.log(`[Task Scheduler Heartbeat] ${now.toISOString()} - CurrentTime: ${currentTime}`);

      // Find tasks that are due but haven't been notified yet
      // Support both new precision (reminderAt) and legacy (dueDate + dueTime)
      const tasks = await Task.find({
        completed: false,
        reminderSent: false,
        $or: [
          { reminderAt: { $lte: now } },
          { 
             reminderAt: { $exists: false },
             dueDate: { $lte: now },
             dueTime: { $lte: currentTime }
          }
        ]
      });

if (tasks.length > 0) {
  console.log(`[Task Scheduler] Found ${tasks.length} pending reminders...`);
}

for (const task of tasks) {
  const user = await User.findById(task.userId);
  if (user) {
    const recipient = user.targetEmail || user.email;
    console.log(`[Task Scheduler] Firing precision reminder: "${task.title}" for ${recipient} (Scheduled: ${task.reminderAt})`);
    await sendTaskEmail(recipient, task, user.name);
    
    task.reminderSent = true;
    await task.save();
  }
}
    } catch (error) {
      console.error('[Task Scheduler Error]:', error.message);
    }
  });
};

module.exports = startTaskScheduler;
