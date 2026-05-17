/**
 * 错误码定义
 */
const ERROR_CODES = {
  // 通用错误
  SUCCESS: 0,
  VALIDATION_ERROR: 1000,
  RESOURCE_NOT_FOUND: 1001,
  CONFLICT: 1002,
  
  // 认证错误
  AUTH_INVALID_CREDENTIALS: 2001,
  AUTH_LOCKED: 2002,
  AUTH_TOKEN_EXPIRED: 2003,
  AUTH_TOKEN_INVALID: 2004,
  
  // 权限错误
  FORBIDDEN: 3001,
  
  // 业务错误
  PLAYLIST_LIMIT_EXCEEDED: 4001,
  PLAYLIST_NAME_DUPLICATE: 4002,
  
  // 限流
  RATE_LIMITED: 5001
};

/**
 * 行为类型
 */
const BEHAVIOR_TYPES = {
  PLAY_START: 'play_start',
  PLAY_END: 'play_end',
  FAVORITE: 'favorite',
  SHARE: 'share',
  DOWNLOAD: 'download'
};

/**
 * 通知类型
 */
const NOTIFICATION_TYPES = {
  COMMENT_REPLIED: 1,
  COMMENT_LIKED: 2,
  COMMENT_MENTIONED: 3
};

/**
 * 播放模式
 */
const PLAY_MODES = {
  SEQUENCE: 'sequence',
  LOOP: 'loop',
  RANDOM: 'random'
};

module.exports = {
  ERROR_CODES,
  BEHAVIOR_TYPES,
  NOTIFICATION_TYPES,
  PLAY_MODES
};

