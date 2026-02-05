const express = require('express');
const { authenticate } = require('../middleware/auth');
const playlistController = require('../controllers/playlistController');

const router = express.Router();

// 获取歌单列表（公开歌单不需要认证）
router.get('/', playlistController.getPlaylistList);

// 获取歌单详情
router.get('/:id', playlistController.getPlaylistDetail);

// 以下路由需要认证
router.use(authenticate);

// 创建歌单
router.post('/', playlistController.createPlaylist);

// 更新歌单
router.put('/:id', playlistController.updatePlaylist);

// 删除歌单
router.delete('/:id', playlistController.deletePlaylist);

// 添加歌曲到歌单
router.post('/:id/songs', playlistController.addSongToPlaylist);

// 从歌单移除歌曲
router.delete('/:id/songs/:songId', playlistController.removeSongFromPlaylist);

module.exports = router;

