const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
