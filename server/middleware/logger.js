const ActivityLog = require('../models/ActivityLog');

exports.logActivity = (action, entity) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (data.success !== false) {
      try {
        await ActivityLog.create({
          user: req.user?._id,
          action,
          entity,
          entityId: data.data?._id,
          details: { method: req.method, path: req.path },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
      } catch (e) { /* silent */ }
    }
    return originalJson(data);
  };
  next();
};
