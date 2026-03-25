const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Test task reminder
router.post('/:id/test-reminder', protect, taskController.testTaskReminder);

// All task routes are protected
router.post('/', protect, taskController.createTask);
router.get('/', protect, taskController.getTasks);
router.patch('/:id/toggle', protect, taskController.toggleComplete);
router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

// Public Link for One-Click Rescheduling (Inbox Actions)
router.get('/:id/reschedule/:days', taskController.rescheduleTask);

module.exports = router;
