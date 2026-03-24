const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All task routes are protected
router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.patch('/:id/toggle', auth, taskController.toggleComplete);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
