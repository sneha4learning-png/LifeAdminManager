const Document = require('../models/Document');
const User = require('../models/User');
const sendReminderEmail = require('../utils/reminderEmail');

const calculateStatus = (expiryDate) => {
  if (!expiryDate) return 'Safe';
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const expDate = new Date(expiryDate);
  expDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Overdue';
  if (diffDays <= 7) return 'Upcoming';
  return 'Safe';
};

exports.getDocuments = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json([]); // Immediate empty response if DB is down
    }
    const documents = await Document.find({ userId: req.user.id });
    res.status(200).json(documents);
  } catch (e) { 
    res.status(200).json([]); // Fallback to empty list instead of 500
  }
};

exports.addDocument = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
       return res.status(201).json({ ...req.body, _id: 'local_' + Date.now(), status: 'Safe' });
    }
    const document = await Document.create({
      ...req.body,
      userId: req.user.id,
      status: calculateStatus(req.body.expiryDate)
    });
    res.status(201).json(document);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        ...req.body, 
        status: req.body.expiryDate ? calculateStatus(req.body.expiryDate) : undefined 
      },
      { new: true, runValidators: true }
    );

    if (!document) return res.status(404).json({ message: 'Record not found or unauthorized' });
    res.status(200).json(document);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!document) return res.status(404).json({ message: 'Record not found or unauthorized' });
    res.status(200).json({ message: 'Record removed successfully', id: req.params.id });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.testReminder = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document) return res.status(404).json({ message: 'Record not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipient = user.email;
    const result = await sendReminderEmail(recipient, document, user.name);

    if (result.success) {
      res.status(200).json({ message: `Success! A test reminder has been dispatched to ${recipient}. Please check your inbox shortly.` });
    } else {
      res.status(500).json({ message: 'Relay failed', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending reminder', error: error.message });
  }
};

