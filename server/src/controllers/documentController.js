const fs = require('fs');
const path = require('path');
const sendReminderEmail = require('../utils/reminderEmail');

const DATA_FILE = path.join(__dirname, '../../local_vault.json');

// Professional file-based persistence helpers
const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) return { users: {}, documents: [] };
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return { users: data.users || {}, documents: data.documents || [] };
  } catch (e) { return { users: {}, documents: [] }; }
};

const saveData = (documents) => {
  let data = loadData();
  data.documents = documents;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

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
    const { documents } = loadData();
    // Filter by user if possible, but for local ease we show all or simulate
    res.status(200).json(documents);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addDocument = async (req, res) => {
  try {
    const { documents } = loadData();
    const document = {
      ...req.body,
      _id: Date.now().toString(),
      userId: req.user?.id || 'local-user',
      status: calculateStatus(req.body.expiryDate),
      createdAt: new Date()
    };
    documents.push(document);
    saveData(documents);
    res.status(201).json(document);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateDocument = async (req, res) => {
  try {
    const { documents } = loadData();
    const index = documents.findIndex(d => d._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Not found' });

    const updated = { ...documents[index], ...req.body };
    if (req.body.expiryDate) updated.status = calculateStatus(req.body.expiryDate);
    
    documents[index] = updated;
    saveData(documents);
    res.status(200).json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteDocument = async (req, res) => {
  try {
    let { documents } = loadData();
    documents = documents.filter(d => d._id !== req.params.id);
    saveData(documents);
    res.status(200).json({ message: 'Record removed', id: req.params.id });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.testReminder = async (req, res) => {
  try {
    const { documents } = loadData();
    const document = documents.find(d => d._id === req.params.id);
    if (!document) return res.status(404).json({ message: 'Record not found' });

    const recipient = req.user?.email || 'sneha4learning@gmail.com';
    const { users } = loadData();
    const userObj = users[recipient];
    
    const result = await sendReminderEmail(recipient, document, userObj?.name || 'Valued Member');

    if (result.success) {
      res.status(200).json({ message: `Success! A test reminder has been dispatched to ${recipient}. Please check your inbox (and spam folder) shortly.` });
    } else {
      res.status(500).json({ message: 'Relay failed', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending reminder', error: error.message });
  }
};
