const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  dueTime: {
    type: String,
    default: '09:00' // Default to 9 AM
  },
  reminderAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  category: {
    type: String,
    default: 'General'
  },
  completed: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Normalize the reminder date time from separate inputs before saving
taskSchema.pre('save', function(next) {
  if (this.dueDate && this.dueTime) {
    const dt = new Date(this.dueDate);
    const [hours, mins] = this.dueTime.split(':');
    dt.setHours(parseInt(hours), parseInt(mins), 0, 0);
    this.reminderAt = dt;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
