# 数据库初始化说明

## 快速开始

### 方式一：使用 MySQL 命令行

1. **登录 MySQL**
```bash
mysql -u root -p
```

2. **创建数据库**
```sql
CREATE DATABASE green_music CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **执行初始化脚本**
```bash
# 在项目根目录下执行
mysql -u root -p green_music < node/migrations/init_database.sql
```

或者进入 MySQL 后执行：
```sql
USE green_music;
SOURCE node/migrations/init_database.sql;
```

### 方式二：使用 MySQL Workbench 或其他 GUI 工具

1. 打开 MySQL Workbench
2. 连接到 MySQL 服务器
3. 创建数据库 `green_music`
4. 打开 `init_database.sql` 文件
5. 选择数据库 `green_music`
6. 执行脚本

### 方式三：使用 Node.js 脚本（推荐）

```bash
# 在 node 目录下执行
npm run db:init
```

（需要先配置 `package.json` 中的脚本）

## 数据库结构说明

### 核心表（20个）

#### 用户相关（2个）
- `users` - 用户表
- `user_login_attempts` - 登录尝试表（用于登录锁定）

#### 内容相关（3个）
- `artists` - 歌手表
- `albums` - 专辑表
- `genres` - 音乐类型表

#### 歌曲相关（4个）
- `songs` - 歌曲表
- `song_genres` - 歌曲类型关联表
- `lyrics` - 歌词表
- `song_stats_daily` - 歌曲日统计表

#### 用户行为相关（3个）
- `play_history` - 播放历史表
- `user_behaviors` - 用户行为表
- `user_favorites` - 用户收藏表

#### 歌单相关（3个）
- `playlists` - 歌单表
- `playlist_songs` - 歌单歌曲关联表
- `playlist_favorites` - 歌单收藏表

#### 评分相关（1个）
- `ratings` - 评分表

#### 评论相关（2个）
- `comments` - 评论表
- `comment_likes` - 评论点赞表

#### 通知相关（2个）
- `notifications` - 通知表
- `notification_settings` - 通知设置表

#### 推荐相关（1个）
- `recommendation_items` - 推荐结果表

#### 管理员相关（1个）
- `admins` - 管理员表

#### 事件发布相关（1个）
- `outbox_events` - 事件发布表（用于可靠事件发布）

## 初始化数据

脚本会自动插入以下初始数据：

- **音乐类型**：流行、摇滚、民谣、电子、爵士、古典、说唱、R&B、古风、轻音乐

## 验证安装

执行以下 SQL 检查表是否创建成功：

```sql
USE green_music;
SHOW TABLES;
```

应该看到 20 个表。

检查表结构：

```sql
DESCRIBE users;
DESCRIBE songs;
DESCRIBE playlists;
```

## 注意事项

1. **字符集**：所有表使用 `utf8mb4` 字符集，支持 emoji 和特殊字符
2. **外键约束**：部分表设置了外键约束，删除数据时需要注意
3. **索引**：已为常用查询字段创建索引，提升查询性能
4. **时间字段**：使用 `DATETIME` 类型，支持自动更新

## 常见问题

### 1. 外键约束错误

如果遇到外键约束错误，可能是表创建顺序问题。请确保：
- 先创建被引用的表（如 `users`, `artists`, `albums`）
- 再创建引用表（如 `songs`）

### 2. 字符集问题

确保数据库使用 `utf8mb4` 字符集：
```sql
ALTER DATABASE green_music CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 权限问题

确保 MySQL 用户有创建表的权限：
```sql
GRANT ALL PRIVILEGES ON green_music.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

## 后续操作

1. **配置环境变量**：在 `.env` 文件中配置数据库连接信息
2. **测试连接**：运行 `npm start` 测试数据库连接
3. **导入测试数据**（可选）：可以手动插入一些测试数据

## 表关系图

```
users
  ├── user_login_attempts
  ├── play_history
  ├── user_behaviors
  ├── user_favorites
  ├── playlists
  │   └── playlist_songs
  ├── ratings
  ├── comments
  │   └── comment_likes
  ├── notifications
  └── recommendation_items

artists
  ├── albums
  │   └── songs
  │       ├── song_genres
  │       ├── lyrics
  │       ├── song_stats_daily
  │       └── playlist_songs

genres
  └── song_genres
```

