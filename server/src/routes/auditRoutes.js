const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/authMiddleware'); // Fix broken import

router.get('/', auth.protect, async (req, res) => { // Use auth.protect
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json([]);
    }
    const logs = await AuditLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(200).json([]);
  }
});

module.exports = router;
