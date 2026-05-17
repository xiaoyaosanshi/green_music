-- ============================================
-- Green Music 完整 Mock 数据初始化脚本
-- ============================================
-- 说明：此脚本包含所有测试数据，可直接在 MySQL 中执行
-- 执行前请确保已执行 init_database.sql 创建表结构
-- ============================================

USE green_music;

-- ============================================
-- 1. 歌手数据
-- ============================================

INSERT INTO artists (name, alias, bio, country, status) VALUES
('周杰伦', 'Jay Chou', '华语流行乐男歌手、原创音乐人、演员、导演', '中国', 1),
('邓紫棋', 'G.E.M.', '华语流行乐女歌手、词曲创作人', '中国', 1),
('林俊杰', 'JJ Lin', '华语流行乐男歌手、词曲创作人、音乐制作人', '新加坡', 1),
('Taylor Swift', '泰勒·斯威夫特', '美国流行乐、乡村音乐创作型女歌手', '美国', 1),
('Ed Sheeran', '艾德·希兰', '英国创作歌手、音乐制作人', '英国', 1),
('毛不易', '巨星不易', '中国内地流行乐男歌手', '中国', 1),
('薛之谦', 'Joker Xue', '中国内地流行乐男歌手、音乐制作人', '中国', 1),
('李荣浩', 'Ronghao Li', '中国内地流行乐男歌手、词曲创作人、音乐制作人', '中国', 1),
('陈奕迅', 'Eason Chan', '中国香港流行乐男歌手、演员', '中国香港', 1),
('王力宏', 'Leehom Wang', '华语流行乐男歌手、音乐制作人、演员', '美国', 1)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- 2. 专辑数据
-- ============================================

INSERT INTO albums (title, artist_id, release_date, description, status) VALUES
('七里香', 1, '2004-08-03', '周杰伦第五张专辑', 1),
('范特西', 1, '2001-09-20', '周杰伦第二张专辑', 1),
('光年之外', 2, '2016-12-30', '邓紫棋单曲', 1),
('新的心跳', 2, '2015-11-06', '邓紫棋第五张专辑', 1),
('伟大的渺小', 3, '2017-12-29', '林俊杰第十三张专辑', 1),
('因你而在', 3, '2013-03-13', '林俊杰第十张专辑', 1),
('1989', 4, '2014-10-27', 'Taylor Swift 第五张录音室专辑', 1),
('Midnights', 4, '2022-10-21', 'Taylor Swift 第十张录音室专辑', 1),
('÷ (Divide)', 5, '2017-03-03', 'Ed Sheeran 第三张录音室专辑', 1),
('消愁', 6, '2017-07-29', '毛不易单曲', 1),
('像我这样的人', 6, '2017-07-29', '毛不易单曲', 1),
('演员', 7, '2015-05-20', '薛之谦单曲', 1),
('模特', 8, '2013-09-17', '李荣浩首张专辑', 1),
('十年', 9, '2003-04-01', '陈奕迅单曲', 1),
('龙的传人', 10, '2000-06-01', '王力宏专辑', 1)
ON DUPLICATE KEY UPDATE title=title;

-- ============================================
-- 3. 歌曲数据
-- ============================================

-- 先删除可能存在的旧数据
DELETE FROM songs WHERE id <= 25;
INSERT INTO songs (id, title, artist_id, album_id, duration, file_url, cover_url, status) VALUES
(1, '七里香', 1, 1, 298, '/uploads/songs/qilixiang.mp3', '/uploads/covers/qilixiang.jpg', 1),
(2, '夜曲', 1, 1, 220, '/uploads/songs/yequ.mp3', '/uploads/covers/yequ.jpg', 1),
(3, '简单爱', 1, 2, 245, '/uploads/songs/jiandanai.mp3', '/uploads/covers/jiandanai.jpg', 1),
(4, '双截棍', 1, 2, 203, '/uploads/songs/shuangjiegun.mp3', '/uploads/covers/shuangjiegun.jpg', 1),
(5, '光年之外', 2, 3, 236, '/uploads/songs/guangnianzhiwai.mp3', '/uploads/covers/guangnianzhiwai.jpg', 1),
(6, '泡沫', 2, 4, 252, '/uploads/songs/paomo.mp3', '/uploads/covers/paomo.jpg', 1),
(7, '画', 2, 4, 228, '/uploads/songs/hua.mp3', '/uploads/covers/hua.jpg', 1),
(8, '修炼爱情', 3, 5, 245, '/uploads/songs/xiulianaiqing.mp3', '/uploads/covers/xiulianaiqing.jpg', 1),
(9, '不为谁而作的歌', 3, 5, 268, '/uploads/songs/buweishui.mp3', '/uploads/covers/buweishui.jpg', 1),
(10, '江南', 3, 6, 245, '/uploads/songs/jiangnan.mp3', '/uploads/covers/jiangnan.jpg', 1),
(11, 'Shake It Off', 4, 7, 219, '/uploads/songs/shakeitoff.mp3', '/uploads/covers/shakeitoff.jpg', 1),
(12, 'Blank Space', 4, 7, 231, '/uploads/songs/blankspace.mp3', '/uploads/covers/blankspace.jpg', 1),
(13, 'Anti-Hero', 4, 8, 201, '/uploads/songs/antihero.mp3', '/uploads/covers/antihero.jpg', 1),
(14, 'Shape of You', 5, 9, 233, '/uploads/songs/shapeofyou.mp3', '/uploads/covers/shapeofyou.jpg', 1),
(15, 'Perfect', 5, 9, 263, '/uploads/songs/perfect.mp3', '/uploads/covers/perfect.jpg', 1),
(16, '消愁', 6, 10, 245, '/uploads/songs/xiaochou.mp3', '/uploads/covers/xiaochou.jpg', 1),
(17, '像我这样的人', 6, 11, 268, '/uploads/songs/xiangwo.mp3', '/uploads/covers/xiangwo.jpg', 1),
(18, '演员', 7, 12, 252, '/uploads/songs/yanyuan.mp3', '/uploads/covers/yanyuan.jpg', 1),
(19, '丑八怪', 7, 12, 245, '/uploads/songs/choubaguai.mp3', '/uploads/covers/choubaguai.jpg', 1),
(20, '模特', 8, 13, 245, '/uploads/songs/mote.mp3', '/uploads/covers/mote.jpg', 1),
(21, '李白', 8, 13, 228, '/uploads/songs/libai.mp3', '/uploads/covers/libai.jpg', 1),
(22, '十年', 9, 14, 245, '/uploads/songs/shinian.mp3', '/uploads/covers/shinian.jpg', 1),
(23, '浮夸', 9, 14, 268, '/uploads/songs/fukua.mp3', '/uploads/covers/fukua.jpg', 1),
(24, '龙的传人', 10, 15, 236, '/uploads/songs/longdechuanren.mp3', '/uploads/covers/longdechuanren.jpg', 1),
(25, '大城小爱', 10, 15, 245, '/uploads/songs/dachengxiaoai.mp3', '/uploads/covers/dachengxiaoai.jpg', 1);

-- ============================================
-- 4. 歌曲类型关联
-- ============================================

INSERT INTO song_genres (song_id, genre_id) VALUES
-- 流行音乐 (genre_id = 1)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1),
(20, 1), (21, 1), (22, 1), (23, 1), (24, 1), (25, 1),
-- 民谣 (genre_id = 3)
(16, 3), (17, 3),
-- R&B (genre_id = 8)
(1, 8), (2, 8), (3, 8),
-- 说唱 (genre_id = 7)
(4, 7),
-- 电子 (genre_id = 4)
(11, 4), (12, 4), (13, 4), (14, 4)
ON DUPLICATE KEY UPDATE song_id=song_id;

-- ============================================
-- 5. 歌词数据
-- ============================================

INSERT INTO lyrics (song_id, language, lrc_content) VALUES
(1, 'zh', '[00:00.00]七里香 - 周杰伦
[00:05.00]作词：方文山
[00:10.00]作曲：周杰伦
[00:15.00]
[00:20.00]窗外的麻雀 在电线杆上多嘴
[00:25.00]你说这一句 很有夏天的感觉
[00:30.00]手中的铅笔 在纸上来来回回
[00:35.00]我用几行字形容你是我的谁
[00:40.00]
[00:45.00]秋刀鱼的滋味 猫跟你都想了解
[00:50.00]初恋的香味就这样被我们寻回
[00:55.00]那温暖的阳光 像刚摘的鲜艳草莓
[01:00.00]你说你舍不得吃掉这一种感觉
[01:05.00]
[01:10.00]雨下整夜 我的爱溢出就像雨水
[01:15.00]院子落叶 跟我的思念厚厚一叠
[01:20.00]几句是非 也无法将我的热情冷却
[01:25.00]你出现在我诗的每一页
'),
(16, 'zh', '[00:00.00]消愁 - 毛不易
[00:05.00]作词：毛不易
[00:10.00]作曲：毛不易
[00:15.00]
[00:20.00]当你走进这欢乐场
[00:25.00]背上所有的梦与想
[00:30.00]各色的脸上各色的妆
[00:35.00]没人记得你的模样
[00:40.00]
[00:45.00]三巡酒过你在角落
[00:50.00]固执的唱着苦涩的歌
[00:55.00]听它在喧嚣里被淹没
[01:00.00]你拿起酒杯对自己说
[01:05.00]
[01:10.00]一杯敬朝阳 一杯敬月光
[01:15.00]唤醒我的向往 温柔了寒窗
[01:20.00]于是可以不回头地逆风飞翔
[01:25.00]不怕心头有雨 眼底有霜
')
ON DUPLICATE KEY UPDATE song_id=song_id;

-- ============================================
-- 6. 用户数据（密码已使用 bcrypt 加密）
-- ============================================
-- 密码说明：
-- testuser1/testuser2/testuser3: Test123456
-- demo: Demo123456

INSERT INTO users (id, username, password_hash, email, nickname, gender, status) VALUES
(1, 'testuser1', '$2b$10$qi34h8FeovDRSz3.vNKlU.wjFMYCz3ITfSrpDPrDzFLhAjML95C6W', 'test1@example.com', '测试用户1', 1, 1),
(2, 'testuser2', '$2b$10$qi34h8FeovDRSz3.vNKlU.wjFMYCz3ITfSrpDPrDzFLhAjML95C6W', 'test2@example.com', '测试用户2', 2, 1),
(3, 'testuser3', '$2b$10$qi34h8FeovDRSz3.vNKlU.wjFMYCz3ITfSrpDPrDzFLhAjML95C6W', 'test3@example.com', '测试用户3', 0, 1),
(4, 'demo', '$2b$10$ONQQWm0t9SjMe4xIbz9Lce1/Th4D7GMV7OeXcZXx4nxi6M5movaQi', 'demo@example.com', '演示用户', 1, 1)
ON DUPLICATE KEY UPDATE username=username;

-- 初始化用户通知设置
INSERT INTO notification_settings (user_id) VALUES
(1), (2), (3), (4)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ============================================
-- 7. 管理员数据
-- ============================================
-- 密码说明：
-- admin: Admin123456
-- operator: Operator123456

INSERT INTO admins (id, username, password_hash, email, nickname, role, status) VALUES
(1, 'admin', '$2b$10$QpgFMQrGCuJGW.JraZTQq./Gj4DmTNJDAf3JHSn9ka7X93T3ldKDy', 'admin@greenmusic.com', '系统管理员', 'super_admin', 1),
(2, 'operator', '$2b$10$1nn2t1quFnmGWUtJgi2h1.RjM/RjdtFfbls9EaCERtnNpjzKFq9ua', 'operator@greenmusic.com', '运营管理员', 'admin', 1)
ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- 8. 歌单数据
-- ============================================

INSERT INTO playlists (id, user_id, name, description, is_public, song_count, status) VALUES
(1, 1, '我的最爱', '我最喜欢的歌曲合集', 1, 8, 1),
(2, 1, '工作时的音乐', '适合工作时听的轻音乐', 1, 6, 1),
(3, 2, '经典老歌', '那些年我们一起听过的歌', 1, 7, 1),
(4, 2, '私人收藏', '我的私人歌单', 0, 5, 1)
ON DUPLICATE KEY UPDATE name=name;

-- 歌单歌曲关联
INSERT INTO playlist_songs (playlist_id, song_id, sort_order) VALUES
-- 我的最爱 (playlist_id = 1)
(1, 1, 1), (1, 2, 2), (1, 5, 3), (1, 6, 4), (1, 8, 5), (1, 10, 6), (1, 16, 7), (1, 22, 8),
-- 工作时的音乐 (playlist_id = 2)
(2, 3, 1), (2, 7, 2), (2, 9, 3), (2, 11, 4), (2, 14, 5), (2, 20, 6),
-- 经典老歌 (playlist_id = 3)
(3, 1, 1), (3, 3, 2), (3, 8, 3), (3, 10, 4), (3, 16, 5), (3, 18, 6), (3, 22, 7),
-- 私人收藏 (playlist_id = 4)
(4, 5, 1), (4, 6, 2), (4, 17, 3), (4, 19, 4), (4, 21, 5)
ON DUPLICATE KEY UPDATE playlist_id=playlist_id;

-- ============================================
-- 9. 评论数据
-- ============================================

INSERT INTO comments (id, user_id, song_id, content, parent_id, root_id, like_count, status) VALUES
(1, 1, 1, '这首歌太好听了！', 0, 0, 2, 1),
(2, 2, 1, '经典老歌，百听不厌', 0, 0, 1, 1),
(3, 1, 2, '歌词写得真好', 0, 0, 0, 1),
(4, 3, 2, '推荐给朋友们', 0, 0, 1, 1),
(5, 2, 3, '单曲循环中...', 0, 0, 0, 1),
(6, 1, 5, '邓紫棋的声音太棒了', 0, 0, 1, 1),
(7, 2, 16, '消愁这首歌太有共鸣了', 0, 0, 2, 1),
(8, 3, 16, '毛不易的歌词总是那么深刻', 0, 0, 1, 1)
ON DUPLICATE KEY UPDATE id=id;

-- 评论点赞数据
INSERT INTO comment_likes (comment_id, user_id) VALUES
(1, 2), (1, 3),
(2, 1),
(4, 1),
(6, 2),
(7, 1), (7, 3),
(8, 1)
ON DUPLICATE KEY UPDATE comment_id=comment_id;

-- 更新评论点赞数
UPDATE comments SET like_count = (
  SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = comments.id
);

-- ============================================
-- 10. 评分数据
-- ============================================

INSERT INTO ratings (user_id, song_id, score) VALUES
-- 用户1的评分
(1, 1, 5), (1, 2, 5), (1, 3, 4), (1, 5, 5), (1, 6, 4), (1, 8, 5), (1, 10, 4), (1, 16, 5),
-- 用户2的评分
(2, 1, 5), (2, 2, 4), (2, 3, 4), (2, 5, 4), (2, 6, 5), (2, 16, 5), (2, 17, 4), (2, 18, 4),
-- 用户3的评分
(3, 1, 4), (3, 2, 5), (3, 5, 5), (3, 8, 4), (3, 10, 5), (3, 16, 5), (3, 22, 4)
ON DUPLICATE KEY UPDATE score=score;

-- ============================================
-- 11. 播放历史数据
-- ============================================

-- 用户1的播放历史（过去30天内）
INSERT INTO play_history (user_id, song_id, played_at, duration_sec) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 180),
(1, 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 200),
(1, 5, DATE_SUB(NOW(), INTERVAL 5 DAY), 220),
(1, 6, DATE_SUB(NOW(), INTERVAL 7 DAY), 240),
(1, 8, DATE_SUB(NOW(), INTERVAL 10 DAY), 200),
(1, 10, DATE_SUB(NOW(), INTERVAL 12 DAY), 220),
(1, 16, DATE_SUB(NOW(), INTERVAL 15 DAY), 180),
(1, 22, DATE_SUB(NOW(), INTERVAL 18 DAY), 200),
(1, 1, DATE_SUB(NOW(), INTERVAL 20 DAY), 298),
(1, 5, DATE_SUB(NOW(), INTERVAL 25 DAY), 236),
-- 用户2的播放历史
(2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 298),
(2, 3, DATE_SUB(NOW(), INTERVAL 4 DAY), 200),
(2, 5, DATE_SUB(NOW(), INTERVAL 6 DAY), 220),
(2, 6, DATE_SUB(NOW(), INTERVAL 8 DAY), 240),
(2, 16, DATE_SUB(NOW(), INTERVAL 11 DAY), 245),
(2, 17, DATE_SUB(NOW(), INTERVAL 14 DAY), 250),
(2, 18, DATE_SUB(NOW(), INTERVAL 16 DAY), 200),
(2, 1, DATE_SUB(NOW(), INTERVAL 22 DAY), 298),
(2, 16, DATE_SUB(NOW(), INTERVAL 28 DAY), 245),
-- 用户3的播放历史
(3, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 220),
(3, 5, DATE_SUB(NOW(), INTERVAL 5 DAY), 236),
(3, 8, DATE_SUB(NOW(), INTERVAL 9 DAY), 200),
(3, 10, DATE_SUB(NOW(), INTERVAL 13 DAY), 245),
(3, 16, DATE_SUB(NOW(), INTERVAL 17 DAY), 240),
(3, 22, DATE_SUB(NOW(), INTERVAL 21 DAY), 200),
(3, 2, DATE_SUB(NOW(), INTERVAL 26 DAY), 220);

-- ============================================
-- 12. 用户收藏数据
-- ============================================

INSERT INTO user_favorites (user_id, song_id) VALUES
(1, 1), (1, 2), (1, 5), (1, 8), (1, 16),
(2, 1), (2, 3), (2, 6), (2, 16), (2, 17),
(3, 2), (3, 5), (3, 10), (3, 16), (3, 22)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ============================================
-- 13. 更新统计数据
-- ============================================

-- 更新歌曲播放次数（基于播放历史）
UPDATE songs s SET play_count = (
  SELECT COUNT(*) FROM play_history ph WHERE ph.song_id = s.id
);

-- 更新歌曲收藏次数
UPDATE songs s SET favorite_count = (
  SELECT COUNT(*) FROM user_favorites uf WHERE uf.song_id = s.id
);

-- ============================================
-- 脚本执行完成
-- ============================================
-- 测试账号：
--   用户名: testuser1, 密码: Test123456
--   用户名: testuser2, 密码: Test123456
--   用户名: testuser3, 密码: Test123456
--   用户名: demo, 密码: Demo123456
-- 
-- 管理员账号：
--   用户名: admin, 密码: Admin123456
--   用户名: operator, 密码: Operator123456
-- ============================================

