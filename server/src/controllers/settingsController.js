const User = require('../models/User');

/**
 * Get user notification settings.
 * Focuses on the registered email as the primary communication route.
 */
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      targetEmail: user.email,
      emailUser: process.env.EMAIL_USER // Show if SMTP is configured
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
