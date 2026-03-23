const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../local_vault.json');

// Professional persistence helper
const loadUsers = () => {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data.users || {};
  } catch (e) { return {}; }
};

const saveUser = (user) => {
  let data = { users: {} };
  if (fs.existsSync(DATA_FILE)) {
    try { data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch(e) {}
  }
  data.users = data.users || {};
  data.users[user.email] = user;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = { _id: Date.now().toString(), name, email, password };
    saveUser(user);
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ ...user, id: user._id, token });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = loadUsers();
    
    // Auto-create for first-time login convenience in local environment
    const user = users[email] || { _id: Date.now().toString(), name: email.split('@')[0], email, password };
    saveUser(user);

    // CRITICAL: Include name and email in the JWT so the middleware relays the real address to Resend
    const token = jwt.sign({ 
        id: user._id, 
        name: user.name, 
        email: user.email 
    }, process.env.JWT_SECRET || 'secret');

    res.status(200).json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const users = loadUsers();
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userEmail = req.user.email;
    
    // Using existing saveUser-like persistence
    let data = { users: {}, documents: [] };
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    
    if (data.users[userEmail]) {
      data.users[userEmail].name = name;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Identity updated', name });
    } else {
      res.status(404).json({ message: 'Configuration error: User record missing' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Profile write protocol failure', error: error.message });
  }
};
