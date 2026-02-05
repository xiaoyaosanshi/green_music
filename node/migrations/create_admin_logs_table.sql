-- 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL COMMENT '管理员ID',
    action_type VARCHAR(50) NOT NULL COMMENT '操作类型: create/update/delete/review/upload/download',
    target_type VARCHAR(50) NOT NULL COMMENT '操作对象类型: song/album/lyric/user/comment/playlist',
    target_id INT COMMENT '操作对象ID',
    action_content VARCHAR(500) COMMENT '操作内容',
    before_data JSON COMMENT '操作前数据',
    after_data JSON COMMENT '操作后数据',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT '用户代理',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_target_type (target_type),
    INDEX idx_created_at (created_at),
    INDEX idx_admin_action (admin_id, action_type),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员操作日志表';

