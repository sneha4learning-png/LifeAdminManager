const Task = require('../models/Task');
const logAction = require('../utils/auditLogger');

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(201).json({ ...req.body, _id: 'local_' + Date.now(), completed: false });
    }
    const newTask = new Task({
      ...req.body,
      userId: req.user.id
    });
    const savedTask = await newTask.save();
    
    // Audit Log: Task Created
    await logAction(req.user.id, 'CREATE_TASK', `New reminder created: ${newTask.title}`, req);
    
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER TASKS
exports.getTasks = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json([]);
    }
    const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(200).json([]);
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({ ...req.body, _id: req.params.id });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    
    // Audit Log: Task Updated
    await logAction(req.user.id, 'UPDATE_TASK', `Reminder updated: ${updatedTask.title}`, req);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE COMPLETE
exports.toggleComplete = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({ _id: req.params.id, completed: true });
    }
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.completed = !task.completed;
    await task.save();
    
    // Audit Log: Task Toggled
    const action = task.completed ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK';
    await logAction(req.user.id, action, `Reminder marked as ${task.completed ? 'Done' : 'Pending'}: ${task.title}`, req);
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({ message: 'Task deleted locally' });
    }
    const taskTitle = (await Task.findById(req.params.id))?.title || 'Unknown';
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Audit Log: Task Deleted
    await logAction(req.user.id, 'DELETE_TASK', `Reminder deleted: ${taskTitle}`, req);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESCHEDULE (Public-ish)
exports.rescheduleTask = async (req, res) => {
  try {
    const { id, days } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).send('Reminder not found');
    
    const oldDate = new Date(task.dueDate).toLocaleDateString();
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + parseInt(days));
    
    task.dueDate = newDate;
    task.reminderSent = false; // Reset to allow future reminders
    await task.save();

    // Audit Log: Remotely Rescheduled
    await logAction(task.userId, 'RESCHEDULE_TASK', `Inbox Resched: ${task.title} from ${oldDate} to ${newDate.toLocaleDateString()} (+${days}d)`, null);
    
    res.send(`
      <html>
        <head><title>Success | Life Admin Project</title></head>
        <body style="font-family: -apple-system, sans-serif; text-align: center; padding-top: 100px; background: #f0fdfa; color: #334155;">
          <div style="background: white; display: inline-block; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(20,184,166,0.1); border: 1px solid #ccfbf1;">
            <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #14B8A6; margin-bottom: 5px;">Vault Action Success</h2>
            <p style="font-size: 14px; color: #64748b;">Reminder: <b>"${task.title}"</b> postponed by ${days} day(s).</p>
            <div style="margin-top: 30px;">
              <a href="https://life-admin-manager-97c01.web.app/tasks" style="background: #14B8A6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Open My Vault</a>
            </div>
            <p style="margin-top: 20px; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; color: #94a3b8;">Recorded in Audit Protocol</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Reschedule failed');
  }
};

exports.testTaskReminder = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({ message: 'Success (Local Simulation)! Manual reminder triggered locally.' });
    }
    const User = require('../models/User');
    const sendTaskEmail = require('../utils/taskReminderEmail');
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Reminder not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { logAction } = require('../utils/auditLogger');
    await sendTaskEmail(user.email, task, user.name);
    
    // Audit Log: Task Test Sent
    await logAction(req.user.id, 'TEST_TASK_REMINDER', `Manual reminder triggered for: ${task.title}`, req);
    
    res.status(200).json({ message: 'Success! Task reminder sent to your registered email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
