const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');

      // --- DEMO MODE BYPASS ---
      const isConnected = require('mongoose').connection.readyState === 1;
      if (!isConnected || decoded.name || decoded.email) {
        req.user = { 
          _id: decoded.id, 
          id: decoded.id, 
          name: decoded.name || 'Demo User', 
          email: decoded.email || 'demo@vault.local' 
        };
        return next();
      }
      // -------------------------

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
