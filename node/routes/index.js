const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const songRoutes = require('./songRoutes');
const playlistRoutes = require('./playlistRoutes');
const commentRoutes = require('./commentRoutes');
const notificationRoutes = require('./notificationRoutes');
const recommendRoutes = require('./recommendRoutes');
const playbackRoutes = require('./playbackRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// 路由注册
router.use('/auth', authRoutes);
router.use('/me', userRoutes);
router.use('/songs', songRoutes);
router.use('/playlists', playlistRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/recommend', recommendRoutes);
router.use('/playback', playbackRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

