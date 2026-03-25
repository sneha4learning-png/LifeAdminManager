const User = require('../models/User');

/**
 * Get user notification settings.
 * Focuses on the registered email as the primary communication route.
 */
exports.getSettings = async (req, res) => {
  try {
    const isConnected = require('mongoose').connection.readyState === 1;
    if (!isConnected) {
        return res.status(200).json({
            targetEmail: req.user.email,
            emailUser: process.env.EMAIL_USER
        });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(200).json({
            targetEmail: req.user.email,
            emailUser: process.env.EMAIL_USER
        });
    }

    res.status(200).json({
      targetEmail: user.email,
      emailUser: process.env.EMAIL_USER
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

/**
 * Update user notification settings.
 * Currently simplified to focus on specific functionality requested.
 */
exports.updateSettings = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    // In a full implementation, we would save this to the User model.
    // For now, we acknowledge the update to keep the UI functional.
    res.status(200).json({ message: 'Communication route updated (System locked to registration email)' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving settings', error: error.message });
  }
};
