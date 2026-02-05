const adminService = require('../services/adminService');

/**
 * 管理员操作日志中间件
 * 自动记录管理后台的操作
 */
const adminLog = (actionType, targetType, getActionContent, getTargetId) => {
  return async (req, res, next) => {
    // 保存原始的 res.json 方法
    const originalJson = res.json.bind(res);

    // 重写 res.json 以在响应后记录日志
    res.json = function(data) {
      // 如果操作成功（code === 0），记录日志
      if (data && data.code === 0) {
        const adminId = req.admin?.id || req.user?.userId;
        const targetId = getTargetId ? getTargetId(req) : req.params.id;
        const actionContent = getActionContent ? getActionContent(req, data) : `${actionType} ${targetType}`;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        // 异步记录日志，不阻塞响应
        adminService.logAction(
          adminId,
          actionType,
          targetType,
          targetId,
          actionContent,
          ipAddress,
          userAgent
        ).catch(err => {
          console.error('记录操作日志失败:', err);
        });
      }

      // 调用原始的 json 方法
      return originalJson(data);
    };

    next();
  };
};

module.exports = { adminLog };

