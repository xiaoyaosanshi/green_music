# Mock 数据初始化说明

## 概述

Mock 数据用于开发和测试，包含：
- 基础数据（歌手、专辑、歌曲、歌词等）
- 用户数据（测试账号、管理员账号）
- 业务数据（歌单、评论、评分、播放历史等）

## 初始化步骤

### 方式一：使用完整 SQL 脚本（推荐）

**一步完成所有数据初始化：**

```bash
# 1. 确保数据库表结构已创建
mysql -u root -p green_music < migrations/init_database.sql

# 2. 执行完整 Mock 数据脚本（包含所有数据）
mysql -u root -p green_music < migrations/init_all_mock_data.sql
```

**或者在 MySQL 中执行：**

```sql
USE green_music;
SOURCE migrations/init_database.sql;
SOURCE migrations/init_all_mock_data.sql;
```

**包含的所有数据：**
- ✅ 10 位歌手
- ✅ 15 张专辑
- ✅ 25 首歌曲
- ✅ 歌曲类型关联
- ✅ 歌词数据
- ✅ 4 个测试用户（密码已加密）
- ✅ 2 个管理员（密码已加密）
- ✅ 4 个歌单（包含歌曲）
- ✅ 8 条评论（包含点赞）
- ✅ 评分数据
- ✅ 播放历史数据
- ✅ 用户收藏数据

### 方式二：分步初始化（旧方式，已废弃）

如果需要分步初始化，可以使用：
- `init_mock_data.sql` - 基础数据
- `init_mock_users.js` - 用户和业务数据（需要 Node.js）

## 测试账号

### 普通用户

| 用户名 | 密码 | 邮箱 |
|--------|------|------|
| testuser1 | Test123456 | test1@example.com |
| testuser2 | Test123456 | test2@example.com |
| testuser3 | Test123456 | test3@example.com |
| demo | Demo123456 | demo@example.com |

### 管理员

| 用户名 | 密码 | 角色 | 邮箱 |
|--------|------|------|------|
| admin | Admin123456 | super_admin | admin@greenmusic.com |
| operator | Operator123456 | admin | operator@greenmusic.com |

## 数据说明

### 歌手数据

包含 10 位知名歌手：
- 周杰伦、邓紫棋、林俊杰（华语）
- Taylor Swift、Ed Sheeran（欧美）
- 毛不易、薛之谦、李荣浩、陈奕迅、王力宏（华语）

### 歌曲数据

包含 25 首歌曲，涵盖：
- 流行音乐
- 民谣
- R&B
- 说唱
- 电子音乐

### 歌单数据

- **我的最爱**：公开歌单，包含 5-10 首歌曲
- **工作时的音乐**：公开歌单
- **经典老歌**：公开歌单
- **私人收藏**：私有歌单

### 评论数据

每条歌曲有 1-2 条评论，用于测试评论功能。

### 评分数据

每首歌曲有 1-3 个用户评分，评分范围 3-5 分。

### 播放历史

每个用户有 5-15 条播放历史记录，时间分布在过去 30 天内。

## 验证数据

### 检查数据是否插入成功

```sql
USE green_music;

-- 检查用户数量
SELECT COUNT(*) as user_count FROM users;

-- 检查歌曲数量
SELECT COUNT(*) as song_count FROM songs;

-- 检查歌单数量
SELECT COUNT(*) as playlist_count FROM playlists;

-- 检查评论数量
SELECT COUNT(*) as comment_count FROM comments;

-- 查看用户列表
SELECT id, username, email, nickname FROM users;

-- 查看歌曲列表
SELECT s.id, s.title, a.name as artist 
FROM songs s 
LEFT JOIN artists a ON s.artist_id = a.id 
LIMIT 10;
```

### 测试登录

使用 Postman 或 curl 测试登录接口：

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "testuser1",
    "password": "Test123456"
  }'
```

## 注意事项

1. **密码安全**：所有密码都使用 bcrypt 加密存储
2. **数据重复**：脚本会检查数据是否已存在，避免重复插入
3. **事务处理**：所有操作都在事务中执行，失败会回滚
4. **环境变量**：确保 `.env` 文件已正确配置数据库连接

## 重新初始化

如果需要重新初始化数据：

### 清空数据（谨慎操作）

```sql
USE green_music;

-- 清空业务数据（保留基础数据）
TRUNCATE TABLE playlists;
TRUNCATE TABLE playlist_songs;
TRUNCATE TABLE comments;
TRUNCATE TABLE comment_likes;
TRUNCATE TABLE ratings;
TRUNCATE TABLE play_history;
TRUNCATE TABLE user_behaviors;
TRUNCATE TABLE user_favorites;
TRUNCATE TABLE notifications;
TRUNCATE TABLE recommendation_items;

-- 清空用户数据
TRUNCATE TABLE user_login_attempts;
TRUNCATE TABLE notification_settings;
TRUNCATE TABLE users;
TRUNCATE TABLE admins;
```

然后重新执行初始化脚本。

### 完全重置（删除所有数据）

```sql
USE green_music;

-- 删除所有表（会删除所有数据）
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS outbox_events;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS recommendation_items;
DROP TABLE IF EXISTS notification_settings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS playlist_favorites;
DROP TABLE IF EXISTS playlist_songs;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS user_behaviors;
DROP TABLE IF EXISTS play_history;
DROP TABLE IF EXISTS song_stats_daily;
DROP TABLE IF EXISTS lyrics;
DROP TABLE IF EXISTS song_genres;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS user_login_attempts;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
```

然后重新执行 `init_database.sql` 和 `init_mock_data.sql`。

## 扩展数据

如果需要更多测试数据，可以：

1. **修改 SQL 脚本**：编辑 `init_mock_data.sql` 添加更多歌手、专辑、歌曲
2. **修改 Node.js 脚本**：编辑 `init_mock_users.js` 添加更多用户、歌单、评论等
3. **使用数据生成工具**：使用 Faker.js 等工具生成随机数据

## 故障排查

### 问题：执行脚本时提示密码错误

**解决**：检查 `.env` 文件中的数据库配置是否正确。

### 问题：提示表不存在

**解决**：先执行 `init_database.sql` 创建表结构。

### 问题：提示外键约束错误

**解决**：确保先执行基础数据脚本（`init_mock_data.sql`），再执行用户数据脚本。

### 问题：用户登录失败

**解决**：
1. 检查用户是否创建成功：`SELECT * FROM users WHERE username = 'testuser1';`
2. 检查密码哈希是否正确生成
3. 确认使用正确的密码（Test123456）

## 相关文件

- `init_database.sql` - 数据库表结构初始化
- `init_mock_data.sql` - 基础数据（歌手、专辑、歌曲）
- `init_mock_users.js` - 用户和业务数据（用户、歌单、评论等）

