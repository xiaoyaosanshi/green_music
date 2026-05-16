// API相关常量
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// 存储键名
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'admin_token',
  ADMIN_INFO: 'admin_info'
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

// 管理员角色
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_ADMIN: 'content_admin',
  OPERATION_ADMIN: 'operation_admin'
}

// 管理员角色文本
export const ADMIN_ROLE_TEXT = {
  [ADMIN_ROLES.SUPER_ADMIN]: '超级管理员',
  [ADMIN_ROLES.CONTENT_ADMIN]: '内容管理员',
  [ADMIN_ROLES.OPERATION_ADMIN]: '运营管理员'
}

// 分页默认值
export const PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20
}

// 音乐状态
export const SONG_STATUS = {
  ONLINE: 1,
  OFFLINE: 0
}

// 音乐状态文本
export const SONG_STATUS_TEXT = {
  [SONG_STATUS.ONLINE]: '上架',
  [SONG_STATUS.OFFLINE]: '下架'
}

// 歌词审核状态
export const LYRIC_REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// 歌词审核状态文本
export const LYRIC_REVIEW_STATUS_TEXT = {
  [LYRIC_REVIEW_STATUS.PENDING]: '待审核',
  [LYRIC_REVIEW_STATUS.APPROVED]: '已通过',
  [LYRIC_REVIEW_STATUS.REJECTED]: '已拒绝'
}

// 歌词类型
export const LYRIC_TYPE = {
  OFFICIAL: 'official',
  USER_UPLOAD: 'user_upload'
}

// 歌词类型文本
export const LYRIC_TYPE_TEXT = {
  [LYRIC_TYPE.OFFICIAL]: '官方',
  [LYRIC_TYPE.USER_UPLOAD]: '用户上传'
}

// 评论审核状态
export const COMMENT_REVIEW_STATUS = {
  NORMAL: 'normal',
  PENDING: 'pending',
  DELETED: 'deleted'
}

// 评论审核状态文本
export const COMMENT_REVIEW_STATUS_TEXT = {
  [COMMENT_REVIEW_STATUS.NORMAL]: '正常',
  [COMMENT_REVIEW_STATUS.PENDING]: '待审核',
  [COMMENT_REVIEW_STATUS.DELETED]: '已删除'
}

// 用户状态
export const USER_STATUS = {
  ACTIVE: 1,
  DISABLED: 0
}

// 用户状态文本
export const USER_STATUS_TEXT = {
  [USER_STATUS.ACTIVE]: '正常',
  [USER_STATUS.DISABLED]: '禁用'
}

// 操作类型
export const ACTION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  REVIEW: 'review',
  UPLOAD: 'upload',
  DOWNLOAD: 'download'
}

// 操作类型文本
export const ACTION_TYPE_TEXT = {
  [ACTION_TYPES.CREATE]: '创建',
  [ACTION_TYPES.UPDATE]: '编辑',
  [ACTION_TYPES.DELETE]: '删除',
  [ACTION_TYPES.REVIEW]: '审核',
  [ACTION_TYPES.UPLOAD]: '上传',
  [ACTION_TYPES.DOWNLOAD]: '下载'
}

// 操作对象类型
export const TARGET_TYPES = {
  SONG: 'song',
  ALBUM: 'album',
  LYRIC: 'lyric',
  USER: 'user',
  COMMENT: 'comment',
  PLAYLIST: 'playlist'
}

// 操作对象类型文本
export const TARGET_TYPE_TEXT = {
  [TARGET_TYPES.SONG]: '音乐',
  [TARGET_TYPES.ALBUM]: '专辑',
  [TARGET_TYPES.LYRIC]: '歌词',
  [TARGET_TYPES.USER]: '用户',
  [TARGET_TYPES.COMMENT]: '评论',
  [TARGET_TYPES.PLAYLIST]: '歌单'
}

// 文件上传限制
export const UPLOAD_LIMITS = {
  COVER_IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPT: 'image/jpeg,image/png,image/jpg'
  },
  MUSIC_FILE: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ACCEPT: 'audio/mpeg,audio/wav,audio/flac,audio/mp3'
  },
  LRC_FILE: {
    MAX_SIZE: 1 * 1024 * 1024, // 1MB
    ACCEPT: '.lrc'
  }
}

