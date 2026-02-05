-- ============================================
-- Green Music Mock 数据初始化脚本
-- ============================================
-- 说明：此脚本用于插入测试数据（不包含用户数据，用户数据请使用 Node.js 脚本）
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

INSERT INTO songs (title, artist_id, album_id, duration, file_url, cover_url, status) VALUES
-- 周杰伦
('七里香', 1, 1, 298, '/uploads/songs/qilixiang.mp3', '/uploads/covers/qilixiang.jpg', 1),
('夜曲', 1, 1, 220, '/uploads/songs/yequ.mp3', '/uploads/covers/yequ.jpg', 1),
('简单爱', 1, 2, 245, '/uploads/songs/jiandanai.mp3', '/uploads/covers/jiandanai.jpg', 1),
('双截棍', 1, 2, 203, '/uploads/songs/shuangjiegun.mp3', '/uploads/covers/shuangjiegun.jpg', 1),
-- 邓紫棋
('光年之外', 2, 3, 236, '/uploads/songs/guangnianzhiwai.mp3', '/uploads/covers/guangnianzhiwai.jpg', 1),
('泡沫', 2, 4, 252, '/uploads/songs/paomo.mp3', '/uploads/covers/paomo.jpg', 1),
('画', 2, 4, 228, '/uploads/songs/hua.mp3', '/uploads/covers/hua.jpg', 1),
-- 林俊杰
('修炼爱情', 3, 5, 245, '/uploads/songs/xiulianaiqing.mp3', '/uploads/covers/xiulianaiqing.jpg', 1),
('不为谁而作的歌', 3, 5, 268, '/uploads/songs/buweishui.mp3', '/uploads/covers/buweishui.jpg', 1),
('江南', 3, 6, 245, '/uploads/songs/jiangnan.mp3', '/uploads/covers/jiangnan.jpg', 1),
-- Taylor Swift
('Shake It Off', 4, 7, 219, '/uploads/songs/shakeitoff.mp3', '/uploads/covers/shakeitoff.jpg', 1),
('Blank Space', 4, 7, 231, '/uploads/songs/blankspace.mp3', '/uploads/covers/blankspace.jpg', 1),
('Anti-Hero', 4, 8, 201, '/uploads/songs/antihero.mp3', '/uploads/covers/antihero.jpg', 1),
-- Ed Sheeran
('Shape of You', 5, 9, 233, '/uploads/songs/shapeofyou.mp3', '/uploads/covers/shapeofyou.jpg', 1),
('Perfect', 5, 9, 263, '/uploads/songs/perfect.mp3', '/uploads/covers/perfect.jpg', 1),
-- 毛不易
('消愁', 6, 10, 245, '/uploads/songs/xiaochou.mp3', '/uploads/covers/xiaochou.jpg', 1),
('像我这样的人', 6, 11, 268, '/uploads/songs/xiangwo.mp3', '/uploads/covers/xiangwo.jpg', 1),
-- 薛之谦
('演员', 7, 12, 252, '/uploads/songs/yanyuan.mp3', '/uploads/covers/yanyuan.jpg', 1),
('丑八怪', 7, 12, 245, '/uploads/songs/choubaguai.mp3', '/uploads/covers/choubaguai.jpg', 1),
-- 李荣浩
('模特', 8, 13, 245, '/uploads/songs/mote.mp3', '/uploads/covers/mote.jpg', 1),
('李白', 8, 13, 228, '/uploads/songs/libai.mp3', '/uploads/covers/libai.jpg', 1),
-- 陈奕迅
('十年', 9, 14, 245, '/uploads/songs/shinian.mp3', '/uploads/covers/shinian.jpg', 1),
('浮夸', 9, 14, 268, '/uploads/songs/fukua.mp3', '/uploads/covers/fukua.jpg', 1),
-- 王力宏
('龙的传人', 10, 15, 236, '/uploads/songs/longdechuanren.mp3', '/uploads/covers/longdechuanren.jpg', 1),
('大城小爱', 10, 15, 245, '/uploads/songs/dachengxiaoai.mp3', '/uploads/covers/dachengxiaoai.jpg', 1)
ON DUPLICATE KEY UPDATE title=title;

-- ============================================
-- 4. 歌曲类型关联
-- ============================================

-- 为歌曲分配类型（假设类型ID：1-流行, 2-摇滚, 3-民谣, 4-电子, 5-爵士, 6-古典, 7-说唱, 8-R&B, 9-古风, 10-轻音乐）
INSERT INTO song_genres (song_id, genre_id) VALUES
-- 流行音乐
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1),
(20, 1), (21, 1), (22, 1), (23, 1), (24, 1), (25, 1),
-- 民谣
(16, 3), (17, 3),
-- R&B
(1, 8), (2, 8), (3, 8), (4, 7), -- 双截棍是说唱
-- 电子
(11, 4), (12, 4), (13, 4), (14, 4)
ON DUPLICATE KEY UPDATE song_id=song_id;

-- ============================================
-- 5. 歌词数据（示例）
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
[01:30.00]
[01:35.00]雨下整夜 我的爱溢出就像雨水
[01:40.00]窗台蝴蝶 像诗里纷飞的美丽章节
[01:45.00]我接着写 把永远爱你写进诗的结尾
[01:50.00]你是我唯一想要的了解
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
[01:30.00]
[01:35.00]一杯敬故乡 一杯敬远方
[01:40.00]守着我的善良 催着我成长
[01:45.00]所以南北的路从此不再漫长
[01:50.00]灵魂不再无处安放
')
ON DUPLICATE KEY UPDATE song_id=song_id;

-- ============================================
-- 6. 管理员数据（密码需要在 Node.js 脚本中生成）
-- ============================================

-- 注意：管理员密码需要使用 bcrypt 加密，请使用 Node.js 脚本生成
-- 这里仅作为示例，实际密码为 "admin123456"
-- INSERT INTO admins (username, password_hash, email, nickname, role) VALUES
-- ('admin', '$2b$10$...', 'admin@greenmusic.com', '管理员', 'super_admin');

-- ============================================
-- 脚本执行完成
-- ============================================
-- 注意：用户数据、歌单数据、评论数据等请使用 Node.js 脚本生成
-- 因为这些数据需要密码加密、复杂的关系处理等
-- ============================================



