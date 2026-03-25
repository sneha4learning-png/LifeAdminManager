const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a document name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['ID', 'Finance', 'Bills', 'Other'],
    default: 'Other',
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date'],
  },
  reminderDaysBefore: {
    type: Number,
    default: 7,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Safe', 'Upcoming', 'Overdue'],
    default: 'Safe',
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
