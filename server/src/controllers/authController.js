const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logAction = require('../utils/auditLogger');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if database is connected or using demo mode
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({
            _id: 'offline_user_' + Date.now(),
            id: 'offline_user_' + Date.now(),
            name: name,
            email: email,
            token: 'offline_token'
        });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email identity.' });
    }

    user = await User.create({ name, email, password });
    
    // Audit Log: Registration
    await logAction(user._id, 'USER_REGISTER', `New account created for ${name}`, req);
    
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'supersecret123', {
        expiresIn: '30d'
    });

    res.status(201).json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration protocol failure', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // --- DATABASE OFFLINE FALLBACK ---
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        // Quick bypass for development/unconfigured environments
        if ((email === 'admin@lifeadmin.com' && password === '1234') || (email === 'sneha4learning@gmail.com')) {
            return res.status(200).json({
                _id: 'demo_user',
                id: 'demo_user',
                name: email === 'sneha4learning@gmail.com' ? 'Sneha' : 'Admin User',
                email: email,
                token: jwt.sign({ id: 'demo_user', name: 'Demo User', email: email }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '30d' })
            });
        }
        return res.status(401).json({ message: 'Authentication server is currently in offline mode' });
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials access denied' });
    }

    const token = jwt.sign({ 
        id: user._id, 
        name: user.name, 
        email: user.email 
    }, process.env.JWT_SECRET || 'supersecret123', {
        expiresIn: '30d'
    });

    // Audit Log: Login
    await logAction(user._id, 'USER_LOGIN', `Successful login from ${email}`, req);
    
    res.status(200).json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication layer failure', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({
            _id: req.user.id,
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(200).json(req.user); // Fallback to token data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profile retrieval error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({ message: 'Profile updated locally (Database Offline)', name: name });
    }

    const user = await User.findById(req.user.id);
    
    if (user) {
      user.name = name || user.name;
      await user.save();
      res.status(200).json({ message: 'Profile updated successfully!', name: user.name });
    } else {
      res.status(200).json({ message: 'Profile updated (temporary mode)', name: name });
    }
  } catch (error) {
    res.status(500).json({ message: 'Profile write protocol failure', error: error.message });
  }
};

