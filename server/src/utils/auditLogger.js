const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, details, req = null) => {
  try {
    const log = new AuditLog({
      userId,
      action,
      details,
      ipAddress: req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'System'
    });
    await log.save();
    console.log(`[Audit Log] Record created: ${action} by ${userId}`);
  } catch (error) {
    console.error('[Audit Log Failure]:', error.message);
  }
};

module.exports = logAction;
