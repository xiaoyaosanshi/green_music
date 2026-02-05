const express = require('express');
const { authenticate } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const { upload } = require('../middleware/upload');

const router = express.Router();

// 管理员登录
router.post('/auth/login', adminController.login);

// 以下路由需要管理员认证
router.use(authenticate);
router.use(adminAuth);

// 获取管理员信息
router.get('/auth/info', adminController.getAdminInfo);

// ==================== 音乐管理 ====================
router.get('/songs', adminController.getSongList);
router.get('/songs/:id', adminController.getSongDetail);
router.post('/songs', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'file', maxCount: 1 }]), adminController.createSong);
router.put('/songs/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'file', maxCount: 1 }]), adminController.updateSong);
router.delete('/songs/:id', adminController.deleteSong);
router.put('/songs/:id/status', adminController.updateSongStatus);
router.post('/songs/batch', adminController.batchOperateSongs);

// ==================== 专辑管理 ====================
router.get('/albums', adminController.getAlbumList);
router.get('/albums/:id', adminController.getAlbumDetail);
router.post('/albums', adminController.createAlbum);
router.put('/albums/:id', adminController.updateAlbum);
router.delete('/albums/:id', adminController.deleteAlbum);

// ==================== 歌词管理 ====================
router.get('/lyrics', adminController.getLyricList);
router.post('/lyrics', adminController.createLyric);
router.put('/lyrics/:id/review', adminController.reviewLyric);
router.delete('/lyrics/:id', adminController.deleteLyric);

// ==================== 用户管理 ====================
router.get('/users', adminController.getUserList);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/status', adminController.updateUserStatus);
router.post('/users/:id/reset-password', adminController.resetUserPassword);
router.delete('/users/:id', adminController.deleteUser);

// ==================== 评论管理 ====================
router.get('/comments', adminController.getCommentList);
router.get('/comments/:id', adminController.getCommentDetail);
router.put('/comments/:id/review', adminController.reviewComment);
router.delete('/comments/:id', adminController.deleteComment);

// ==================== 歌单管理 ====================
router.get('/playlists', adminController.getPlaylistList);
router.get('/playlists/:id', adminController.getPlaylistDetail);
router.put('/playlists/:id', adminController.updatePlaylist);
router.delete('/playlists/:id', adminController.deletePlaylist);

// ==================== 数据统计 ====================
router.get('/statistics', adminController.getStatistics);
router.get('/statistics/users', adminController.getUserStatistics);
router.get('/statistics/songs', adminController.getSongStatistics);
router.get('/statistics/playback', adminController.getPlaybackStatistics);
router.get('/statistics/recommend', adminController.getRecommendStatistics);

// ==================== 操作日志 ====================
router.get('/logs', adminController.getLogList);
router.get('/logs/:id', adminController.getLogDetail);

// ==================== 文件上传 ====================
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      code: 'UPLOAD_ERROR',
      message: '没有上传文件',
      data: null
    });
  }
  // 构建正确的URL路径
  let fileUrl = req.file.path.replace(/\\/g, '/');
  if (!fileUrl.startsWith('/')) {
    fileUrl = '/' + fileUrl;
  }
  
  res.json({
    code: 0,
    message: '上传成功',
    data: {
      url: fileUrl,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

module.exports = router;

