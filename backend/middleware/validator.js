const { body, validationResult } = require('express-validator');
const ResponseHelper = require('../utils/response');
const { ERROR_CODES } = require('../utils/constants');

/**
 * 验证结果处理中间件
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper.error(
      res,
      ERROR_CODES.VALIDATION_ERROR,
      errors.array()[0].msg
    );
  }
  next();
};

/**
 * 登录验证规则
 */
const validateLogin = [
  body('identity')
    .notEmpty().withMessage('用户名或邮箱不能为空')
    .trim(),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6 }).withMessage('密码至少6位'),
  handleValidationErrors
];

/**
 * 注册验证规则
 */
const validateRegister = [
  body('username')
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 50 }).withMessage('用户名长度3-50字符')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 8 }).withMessage('密码至少8位')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('密码必须包含字母和数字'),
  body('email')
    .notEmpty().withMessage('邮箱不能为空')
    .isEmail().withMessage('邮箱格式不正确'),
  body('nickname')
    .optional()
    .isLength({ max: 50 }).withMessage('昵称最多50字符'),
  handleValidationErrors
];

/**
 * 评论验证规则
 */
const validateComment = [
  body('songId')
    .notEmpty().withMessage('歌曲ID不能为空')
    .isInt().withMessage('歌曲ID必须是整数'),
  body('content')
    .notEmpty().withMessage('评论内容不能为空')
    .isLength({ min: 1, max: 1000 }).withMessage('评论内容1-1000字符'),
  body('parentId')
    .optional()
    .isInt().withMessage('父评论ID必须是整数'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateComment,
  handleValidationErrors
};

