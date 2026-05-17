-- ============================================
-- Green Music 数据库初始化脚本
-- ============================================
-- 说明：此脚本用于初始化 Green Music 平台的所有数据库表
-- 执行前请确保已创建数据库：CREATE DATABASE green_music CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ============================================

-- 使用数据库
USE green_music;

-- ============================================
-- 1. 用户相关表
-- ============================================

-- 1.1 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别: 0-未知, 1-男, 2-女',
    birthday DATE COMMENT '生日',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-封禁, 1-正常',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 1.2 登录尝试表
CREATE TABLE IF NOT EXISTS user_login_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identity VARCHAR(100) NOT NULL COMMENT '登录标识(username/email)',
    ip VARCHAR(45) COMMENT 'IP地址',
    fail_count INT DEFAULT 0 COMMENT '失败次数',
    locked_until DATETIME COMMENT '锁定到期时间',
    last_failed_at DATETIME COMMENT '最后失败时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_identity (identity),
    INDEX idx_locked_until (locked_until),
    INDEX idx_ip (ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录尝试表';

-- ============================================
-- 2. 内容相关表（歌手、专辑、类型）
-- ============================================

-- 2.1 歌手表
CREATE TABLE IF NOT EXISTS artists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '歌手名称',
    alias VARCHAR(200) COMMENT '别名',
    avatar VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '简介',
    country VARCHAR(50) COMMENT '国家/地区',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_status (status),
    FULLTEXT idx_fulltext (name, alias)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌手表';

-- 2.2 专辑表
CREATE TABLE IF NOT EXISTS albums (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '专辑名称',
    artist_id INT NOT NULL COMMENT '歌手ID',
    cover_url VARCHAR(500) COMMENT '封面图片URL',
    release_date DATE COMMENT '发行日期',
    description TEXT COMMENT '专辑描述',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_id (artist_id),
    INDEX idx_title (title),
    INDEX idx_status (status),
    INDEX idx_release_date (release_date),
    FULLTEXT idx_fulltext (title),
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专辑表';

-- 2.3 音乐类型表
CREATE TABLE IF NOT EXISTS genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '类型名称',
    description VARCHAR(200) COMMENT '类型描述',
    icon VARCHAR(200) COMMENT '图标URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音乐类型表';

-- ============================================
-- 3. 歌曲相关表
-- ============================================

-- 3.1 歌曲表
CREATE TABLE IF NOT EXISTS songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '歌曲名称',
    artist_id INT NOT NULL COMMENT '歌手ID',
    album_id INT COMMENT '专辑ID',
    duration INT NOT NULL COMMENT '时长(秒)',
    file_url VARCHAR(500) NOT NULL COMMENT '音频文件URL',
    cover_url VARCHAR(500) COMMENT '封面图片URL',
    play_count INT DEFAULT 0 COMMENT '播放次数',
    favorite_count INT DEFAULT 0 COMMENT '收藏次数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_id (artist_id),
    INDEX idx_album_id (album_id),
    INDEX idx_title (title),
    INDEX idx_status (status),
    INDEX idx_play_count (play_count),
    FULLTEXT idx_fulltext (title),
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE RESTRICT,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音乐表';

-- 3.2 歌曲类型关联表
CREATE TABLE IF NOT EXISTS song_genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    song_id INT NOT NULL COMMENT '歌曲ID',
    genre_id INT NOT NULL COMMENT '类型ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_song_genre (song_id, genre_id),
    INDEX idx_song_id (song_id),
    INDEX idx_genre_id (genre_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌曲类型关联表';

-- 3.3 歌词表
CREATE TABLE IF NOT EXISTS lyrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    song_id INT NOT NULL COMMENT '歌曲ID',
    language VARCHAR(10) DEFAULT 'zh' COMMENT '语言: zh-中文, en-英文等',
    lrc_content TEXT NOT NULL COMMENT 'LRC格式歌词内容',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_song_language (song_id, language),
    INDEX idx_song_id (song_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌词表';

-- 3.4 歌曲日统计表
CREATE TABLE IF NOT EXISTS song_stats_daily (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE NOT NULL COMMENT '统计日期',
    song_id INT NOT NULL COMMENT '歌曲ID',
    play_count INT DEFAULT 0 COMMENT '播放次数',
    play_user_count INT DEFAULT 0 COMMENT '播放用户数',
    favorite_count INT DEFAULT 0 COMMENT '收藏次数',
    share_count INT DEFAULT 0 COMMENT '分享次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_date_song (stat_date, song_id),
    INDEX idx_stat_date (stat_date),
    INDEX idx_song_id (song_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌曲日统计表';

-- ============================================
-- 4. 用户行为相关表
-- ============================================

-- 4.1 播放历史表
CREATE TABLE IF NOT EXISTS play_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '播放时间',
    duration_sec INT DEFAULT 0 COMMENT '播放时长(秒)',
    INDEX idx_user_played (user_id, played_at DESC),
    INDEX idx_song_id (song_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='播放历史表';

-- 4.2 用户行为表
CREATE TABLE IF NOT EXISTS user_behaviors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    behavior_type VARCHAR(20) NOT NULL COMMENT '行为类型: play_start, play_end, favorite, share, download',
    duration INT DEFAULT 0 COMMENT '播放时长(秒)',
    meta_json JSON COMMENT '扩展信息(设备、播放模式等)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_song_created (song_id, created_at DESC),
    INDEX idx_behavior_type (behavior_type, created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为表';

-- 4.3 用户收藏表（收藏歌曲）
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_song (user_id, song_id),
    INDEX idx_user_id (user_id),
    INDEX idx_song_id (song_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';

-- ============================================
-- 5. 歌单相关表
-- ============================================

-- 5.1 歌单表
CREATE TABLE IF NOT EXISTS playlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '创建者ID',
    name VARCHAR(100) NOT NULL COMMENT '歌单名称',
    description TEXT COMMENT '歌单描述',
    cover_url VARCHAR(500) COMMENT '封面图片URL',
    is_public TINYINT DEFAULT 1 COMMENT '是否公开: 0-私有, 1-公开',
    play_count INT DEFAULT 0 COMMENT '播放次数',
    favorite_count INT DEFAULT 0 COMMENT '收藏次数',
    song_count INT DEFAULT 0 COMMENT '歌曲数量',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_is_public (is_public),
    FULLTEXT idx_fulltext (name, description),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌单表';

-- 5.2 歌单歌曲关联表
CREATE TABLE IF NOT EXISTS playlist_songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlist_id INT NOT NULL COMMENT '歌单ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
    INDEX idx_playlist_id (playlist_id),
    INDEX idx_song_id (song_id),
    INDEX idx_sort_order (playlist_id, sort_order),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌单歌曲关联表';

-- 5.3 歌单收藏表
CREATE TABLE IF NOT EXISTS playlist_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    playlist_id INT NOT NULL COMMENT '歌单ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_playlist (user_id, playlist_id),
    INDEX idx_user_id (user_id),
    INDEX idx_playlist_id (playlist_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='歌单收藏表';

-- ============================================
-- 6. 评分相关表
-- ============================================

-- 6.1 评分表
CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    score TINYINT NOT NULL COMMENT '评分: 1-5',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_song (user_id, song_id),
    INDEX idx_user_id (user_id),
    INDEX idx_song_id (song_id),
    INDEX idx_score (score),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评分表';

-- ============================================
-- 7. 评论相关表
-- ============================================

-- 7.1 评论表
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    song_id INT NOT NULL COMMENT '歌曲ID',
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id INT DEFAULT 0 COMMENT '父评论ID(回复)',
    root_id INT DEFAULT 0 COMMENT '根评论ID',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_song_created (song_id, created_at DESC),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_root_id (root_id),
    FULLTEXT idx_fulltext (content),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 7.2 评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL COMMENT '评论ID',
    user_id INT NOT NULL COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_comment_user (comment_id, user_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论点赞表';

-- ============================================
-- 8. 通知相关表
-- ============================================

-- 8.1 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '接收通知的用户ID',
    type TINYINT NOT NULL COMMENT '通知类型: 1-评论回复, 2-评论点赞, 3-评论被回复',
    related_id INT NOT NULL COMMENT '关联ID(评论ID)',
    related_type VARCHAR(20) NOT NULL COMMENT '关联类型: song, album, playlist',
    sender_id INT COMMENT '发送者ID',
    content VARCHAR(500) COMMENT '通知内容',
    payload_json JSON COMMENT '跳转信息(songId, commentId等)',
    event_id VARCHAR(64) COMMENT '事件ID(幂等)',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读: 0-未读, 1-已读',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_read_created (user_id, is_read, created_at DESC),
    INDEX idx_type (type),
    INDEX idx_event_id (event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 8.2 通知设置表
CREATE TABLE IF NOT EXISTS notification_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    notify_like_comment TINYINT DEFAULT 1 COMMENT '评论被点赞通知',
    notify_reply_comment TINYINT DEFAULT 1 COMMENT '评论被回复通知',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知设置表';

-- ============================================
-- 9. 推荐相关表
-- ============================================

-- 9.1 推荐结果表
CREATE TABLE IF NOT EXISTS recommendation_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    item_type VARCHAR(20) NOT NULL COMMENT '推荐类型: song, playlist, artist, album',
    item_id INT NOT NULL COMMENT '推荐项ID',
    score DECIMAL(10, 6) NOT NULL COMMENT '推荐分数',
    reason VARCHAR(200) COMMENT '推荐理由',
    algo_version VARCHAR(20) DEFAULT 'v1' COMMENT '算法版本',
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    INDEX idx_user_type_score (user_id, item_type, score DESC),
    INDEX idx_generated_at (generated_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推荐结果表';

-- ============================================
-- 10. 管理员相关表
-- ============================================

-- 10.1 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    nickname VARCHAR(50) COMMENT '昵称',
    role VARCHAR(20) DEFAULT 'admin' COMMENT '角色: admin-管理员, super_admin-超级管理员',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================
-- 11. 事件发布相关表（用于可靠事件发布）
-- ============================================

-- 11.1 事件发布表（Outbox Pattern）
CREATE TABLE IF NOT EXISTS outbox_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50) NOT NULL COMMENT '事件类型',
    aggregate_type VARCHAR(50) NOT NULL COMMENT '聚合类型',
    aggregate_id VARCHAR(100) NOT NULL COMMENT '聚合ID',
    payload JSON NOT NULL COMMENT '事件负载',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待发布, 1-已发布, 2-发布失败',
    retry_count INT DEFAULT 0 COMMENT '重试次数',
    published_at DATETIME COMMENT '发布时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_created (status, created_at),
    INDEX idx_event_type (event_type),
    INDEX idx_aggregate (aggregate_type, aggregate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='事件发布表';

-- ============================================
-- 初始化数据（可选）
-- ============================================

-- 插入默认音乐类型
INSERT INTO genres (name, description, sort_order) VALUES
('流行', '流行音乐', 1),
('摇滚', '摇滚音乐', 2),
('民谣', '民谣音乐', 3),
('电子', '电子音乐', 4),
('爵士', '爵士音乐', 5),
('古典', '古典音乐', 6),
('说唱', '说唱音乐', 7),
('R&B', '节奏布鲁斯', 8),
('古风', '古风音乐', 9),
('轻音乐', '轻音乐', 10)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- 脚本执行完成
-- ============================================
-- 所有表已创建完成
-- 请检查是否有错误信息
-- ============================================

