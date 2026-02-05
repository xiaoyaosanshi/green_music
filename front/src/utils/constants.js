// API相关常量
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  PLAY_HISTORY: 'playHistory',
  SEARCH_HISTORY: 'searchHistory'
}

// 播放模式
export const PLAY_MODES = {
  SEQUENCE: 'sequence', // 顺序播放
  LOOP: 'loop', // 单曲循环
  RANDOM: 'random' // 随机播放
}

// 播放模式文本
export const PLAY_MODE_TEXT = {
  [PLAY_MODES.SEQUENCE]: '顺序播放',
  [PLAY_MODES.LOOP]: '单曲循环',
  [PLAY_MODES.RANDOM]: '随机播放'
}

// 分页默认值
export const PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20
}

// 响应码
export const RESPONSE_CODE = {
  SUCCESS: 0
}

// 错误码
export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_LOCKED: 'AUTH_LOCKED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
}

