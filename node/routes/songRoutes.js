const express = require('express');
const songController = require('../controllers/songController');

const router = express.Router();

// 获取歌曲列表
router.get('/', songController.getSongList);

// 获取歌曲详情
router.get('/:id', songController.getSongDetail);

// 获取歌词
router.get('/:id/lyrics', songController.getLyrics);

module.exports = router;

