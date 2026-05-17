/**
 * 统一响应格式
 */
class ResponseHelper {
  /**
   * 成功响应
   */
  static success(res, data = null, message = 'success') {
    return res.status(200).json({
      code: 0,
      message,
      data
    });
  }

  /**
   * 错误响应
   */
  static error(res, code, message, statusCode = 400) {
    return res.status(statusCode).json({
      code,
      message,
      data: null
    });
  }

  /**
   * 分页响应
   */
  static pagination(res, list, total, page, pageSize) {
    return res.status(200).json({
      code: 0,
      message: 'success',
      data: {
        list,
        total: parseInt(total),
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    });
  }
}

module.exports = ResponseHelper;

