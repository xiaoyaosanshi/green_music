const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const songsDir = path.join(uploadDir, 'songs');
const coversDir = path.join(uploadDir, 'covers');

[uploadDir, songsDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 音频文件存储配置
const songStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, songsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `song-${uniqueSuffix}${ext}`);
  }
});

// 封面图片存储配置
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coversDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `cover-${uniqueSuffix}${ext}`);
  }
});

// 文件类型过滤
const audioFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/mp3,audio/wav').split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的音频格式'), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的图片格式'), false);
  }
};

// 文件大小限制
const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 默认 50MB

// 上传中间件
const uploadSong = multer({
  storage: songStorage,
  fileFilter: audioFilter,
  limits: { fileSize: maxSize }
});

const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 封面图片 5MB
});

// 通用文件上传（用于管理后台）
const generalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 根据文件类型选择目录
    if (file.mimetype.startsWith('audio/')) {
      cb(null, songsDir);
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, coversDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: generalStorage,
  limits: { fileSize: maxSize }
});

module.exports = {
  uploadSong,
  uploadCover,
  upload
};

