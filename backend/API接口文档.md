# Green Music API 接口文档

## 基础信息

- **Base URL**: `http://localhost:3001`
- **API 版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8

## 统一响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### 错误响应
```json
{
  "code": "ERROR_CODE",
  "message": "错误描述",
  "data": null
}
```

## 认证方式

大部分接口需要 JWT Token 认证，在请求头中携带：

```
Authorization: Bearer <token>
```

---

## 1. 健康检查

### GET /health

检查服务健康状态

**请求示例**
```bash
curl http://localhost:3001/health
```

**响应示例**
```json
{
  "status": "ok",
  "timestamp": "2026-02-04T08:00:00.000Z",
  "uptime": 3600.123
}
```

---

## 2. 用户认证

### 2.1 用户登录

**POST /api/auth/login**

用户登录，获取 JWT Token

**请求参数**
```json
{
  "identity": "testuser1",  // 用户名或邮箱
  "password": "Test123456"
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identity":"testuser1","password":"Test123456"}'
```

**响应示例**
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "testuser1",
      "nickname": "测试用户1",
      "avatar": null,
      "email": "test1@example.com"
    }
  }
}
```

### 2.2 用户注册

**POST /api/auth/register**

用户注册

**请求参数**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123",
  "nickname": "新用户"
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "Password123",
    "nickname": "新用户"
  }'
```

---

## 3. 用户信息

### 3.1 获取当前用户信息

**GET /api/me**

获取当前登录用户的信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/me
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser1",
    "email": "test1@example.com",
    "nickname": "测试用户1",
    "avatar": null,
    "gender": 1,
    "birthday": null,
    "created_at": "2026-02-04T02:41:42.000Z"
  }
}
```

### 3.2 更新用户信息

**PUT /api/me**

更新当前用户信息

**认证**: 需要 Token

**请求参数**
```json
{
  "nickname": "新昵称",
  "avatar": "http://example.com/avatar.jpg",
  "gender": 1,
  "birthday": "1990-01-01"
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nickname":"新昵称"}'
```

---

## 4. 歌曲相关

### 4.1 获取歌曲列表

**GET /api/songs**

获取歌曲列表，支持分页和筛选

**查询参数**
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20
- `keyword` (string, 可选): 搜索关键词（歌曲名或歌手名）
- `genreId` (number, 可选): 类型ID
- `artistId` (number, 可选): 歌手ID

**请求示例**
```bash
# 获取第一页，每页2条
curl "http://localhost:3001/api/songs?page=1&pageSize=2"

# 搜索歌曲
curl "http://localhost:3001/api/songs?keyword=周杰伦&page=1&pageSize=10"

# 按类型筛选
curl "http://localhost:3001/api/songs?genreId=1&page=1&pageSize=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 75,
        "title": "大城小爱",
        "artist_id": 10,
        "album_id": 15,
        "duration": 245,
        "file_url": "/uploads/songs/dachengxiaoai.mp3",
        "cover_url": "/uploads/covers/dachengxiaoai.jpg",
        "play_count": 0,
        "favorite_count": 0,
        "status": 1,
        "created_at": "2026-02-04T03:51:42.000Z",
        "updated_at": "2026-02-04T03:51:42.000Z",
        "artist_name": "王力宏",
        "album_name": "龙的传人"
      }
    ],
    "total": 75,
    "page": 1,
    "pageSize": 1,
    "totalPages": 75
  }
}
```

### 4.2 获取歌曲详情

**GET /api/songs/:id**

获取指定歌曲的详细信息

**路径参数**
- `id` (number): 歌曲ID

**请求示例**
```bash
curl http://localhost:3001/api/songs/1
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "七里香",
    "artist_id": 1,
    "album_id": 1,
    "duration": 298,
    "file_url": "/uploads/songs/qilixiang.mp3",
    "cover_url": "/uploads/covers/qilixiang.jpg",
    "play_count": 4,
    "favorite_count": 2,
    "status": 1,
    "artist_name": "周杰伦",
    "artist_avatar": null,
    "album_name": "七里香",
    "album_cover": null,
    "genres": [
      {"id": 1, "name": "流行"},
      {"id": 8, "name": "R&B"}
    ]
  }
}
```

### 4.3 获取歌词

**GET /api/songs/:id/lyrics**

获取指定歌曲的歌词

**路径参数**
- `id` (number): 歌曲ID

**查询参数**
- `language` (string, 可选): 语言，默认 "zh"

**请求示例**
```bash
curl "http://localhost:3001/api/songs/1/lyrics?language=zh"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "songId": "1",
    "lyrics": [
      {
        "id": 1,
        "language": "zh",
        "content": "[00:00.00]七里香 - 周杰伦\n[00:05.00]作词：方文山\n..."
      }
    ]
  }
}
```

---

## 5. 播放历史

### 5.1 获取播放历史

**GET /api/me/play-history**

获取当前用户的播放历史

**认证**: 需要 Token

**查询参数**
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/me/play-history?page=1&pageSize=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "song_id": 1,
        "played_at": "2026-02-02T02:41:42.000Z",
        "duration_sec": 180,
        "title": "七里香",
        "cover_url": "/uploads/covers/qilixiang.jpg",
        "duration": 298,
        "artist_id": 1,
        "artist_name": "周杰伦"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 1,
    "totalPages": 10
  }
}
```

### 5.2 清空播放历史

**DELETE /api/me/play-history**

清空当前用户的播放历史

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/me/play-history \
  -H "Authorization: Bearer <token>"
```

---

## 6. 歌单相关

### 6.1 获取歌单列表

**GET /api/playlists**

获取歌单列表

**认证**: 需要 Token（获取公开歌单时可选）

**查询参数**
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20
- `userId` (number, 可选): 用户ID，不传则获取公开歌单
- `keyword` (string, 可选): 搜索关键词

**请求示例**
```bash
# 获取公开歌单
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/playlists?page=1&pageSize=10"

# 获取指定用户的歌单
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/playlists?userId=1&page=1&pageSize=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "name": "我的最爱",
        "description": "我最喜欢的歌曲合集",
        "cover_url": null,
        "is_public": 1,
        "play_count": 0,
        "favorite_count": 0,
        "song_count": 8,
        "status": 1,
        "username": "testuser1",
        "nickname": "测试用户1",
        "avatar": null
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### 6.2 获取歌单详情

**GET /api/playlists/:id**

获取指定歌单的详细信息，包括歌曲列表

**认证**: 需要 Token

**路径参数**
- `id` (number): 歌单ID

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/playlists/1
```

### 6.3 创建歌单

**POST /api/playlists**

创建新歌单

**认证**: 需要 Token

**请求参数**
```json
{
  "name": "我的歌单",
  "description": "歌单描述",
  "isPublic": true
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/playlists \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的歌单",
    "description": "歌单描述",
    "isPublic": true
  }'
```

---

## 7. 评论相关

### 7.1 获取评论列表

**GET /api/comments**

获取歌曲的评论列表

**查询参数**
- `songId` (number, 必需): 歌曲ID
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20
- `sort` (string, 可选): 排序方式，"time" 或 "hot"，默认 "time"

**请求示例**
```bash
curl "http://localhost:3001/api/comments?songId=1&page=1&pageSize=10&sort=hot"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "song_id": 1,
        "content": "这首歌太好听了！",
        "parent_id": 0,
        "root_id": 0,
        "like_count": 2,
        "status": 1,
        "created_at": "2026-02-04T02:41:42.000Z",
        "updated_at": "2026-02-04T02:41:42.000Z",
        "username": "testuser1",
        "nickname": "测试用户1",
        "avatar": null,
        "replies": []
      }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 1,
    "totalPages": 2
  }
}
```

### 7.2 发表评论

**POST /api/comments**

发表评论

**认证**: 需要 Token

**请求参数**
```json
{
  "songId": 1,
  "content": "评论内容",
  "parentId": 0  // 父评论ID，0表示顶级评论
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "songId": 1,
    "content": "这首歌真好听！",
    "parentId": 0
  }'
```

### 7.3 点赞评论

**POST /api/comments/:id/like**

点赞评论

**认证**: 需要 Token

**路径参数**
- `id` (number): 评论ID

**请求示例**
```bash
curl -X POST http://localhost:3001/api/comments/1/like \
  -H "Authorization: Bearer <token>"
```

### 7.4 取消点赞

**DELETE /api/comments/:id/like**

取消点赞

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/comments/1/like \
  -H "Authorization: Bearer <token>"
```

---

## 8. 通知相关

### 8.1 获取通知列表

**GET /api/notifications**

获取当前用户的通知列表

**认证**: 需要 Token

**查询参数**
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20
- `isRead` (number, 可选): 是否已读，0-未读，1-已读

**请求示例**
```bash
# 获取所有通知
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/notifications?page=1&pageSize=10"

# 获取未读通知
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/notifications?isRead=0&page=1&pageSize=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "pageSize": 1,
    "totalPages": 0,
    "unreadCount": 0
  }
}
```

### 8.2 获取未读通知数量

**GET /api/notifications/unread-count**

获取未读通知数量

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/notifications/unread-count
```

### 8.3 标记通知为已读

**PUT /api/notifications/:id/read**

标记指定通知为已读

**认证**: 需要 Token

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/notifications/1/read \
  -H "Authorization: Bearer <token>"
```

### 8.4 全部标记为已读

**PUT /api/notifications/read-all**

将所有通知标记为已读

**认证**: 需要 Token

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/notifications/read-all \
  -H "Authorization: Bearer <token>"
```

---

## 9. 推荐相关

### 9.1 获取个性化推荐

**GET /api/recommend/personal**

获取基于用户行为的个性化推荐

**认证**: 需要 Token

**查询参数**
- `type` (string, 可选): 推荐类型，"song" | "playlist" | "artist" | "album"，默认 "song"
- `limit` (number, 可选): 返回数量，默认 20

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/recommend/personal?type=song&limit=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "recommendations": [
      {
        "songId": 1,
        "song": {
          "id": 1,
          "title": "七里香",
          "coverUrl": "/uploads/covers/qilixiang.jpg",
          "artist": {
            "id": 1,
            "name": "周杰伦"
          }
        },
        "score": 0.95,
        "reason": "基于您的播放历史推荐"
      }
    ]
  }
}
```

### 9.2 获取热门推荐

**GET /api/recommend/hot**

获取热门推荐（无需登录）

**查询参数**
- `type` (string, 可选): 推荐类型，默认 "song"
- `limit` (number, 可选): 返回数量，默认 20

**请求示例**
```bash
curl "http://localhost:3001/api/recommend/hot?type=song&limit=10"
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 75,
        "title": "大城小爱",
        "coverUrl": "/uploads/covers/dachengxiaoai.jpg",
        "artist": {
          "id": 10,
          "name": "王力宏"
        }
      },
      {
        "id": 51,
        "title": "七里香",
        "coverUrl": "/uploads/covers/qilixiang.jpg",
        "artist": {
          "id": 1,
          "name": "周杰伦"
        }
      }
    ]
  }
}
```

### 9.3 获取相似歌曲

**GET /api/recommend/similar/:songId**

获取与指定歌曲相似的歌曲

**路径参数**
- `songId` (number): 歌曲ID

**查询参数**
- `limit` (number, 可选): 返回数量，默认 10

**请求示例**
```bash
curl "http://localhost:3001/api/recommend/similar/1?limit=5"
```

---

## 10. 收藏相关

### 10.1 收藏歌曲

**POST /api/favorites/songs/:songId**

收藏歌曲

**认证**: 需要 Token

**请求示例**
```bash
curl -X POST http://localhost:3001/api/favorites/songs/1 \
  -H "Authorization: Bearer <token>"
```

### 10.2 取消收藏

**DELETE /api/favorites/songs/:songId**

取消收藏歌曲

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/favorites/songs/1 \
  -H "Authorization: Bearer <token>"
```

### 10.3 获取收藏列表

**GET /api/favorites/songs**

获取当前用户的收藏列表

**认证**: 需要 Token

**查询参数**
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 20

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/favorites/songs?page=1&pageSize=10"
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| AUTH_INVALID_CREDENTIALS | 用户名或密码错误 |
| AUTH_LOCKED | 账户被锁定 |
| AUTH_TOKEN_INVALID | Token 无效或已过期 |
| AUTH_TOKEN_MISSING | 缺少 Token |
| VALIDATION_ERROR | 参数验证失败 |
| NOT_FOUND | 资源不存在 |
| PERMISSION_DENIED | 权限不足 |
| INTERNAL_ERROR | 服务器内部错误 |

---

## 测试账号

- **用户名**: testuser1
- **密码**: Test123456
- **邮箱**: test1@example.com

---

## 注意事项

1. 所有需要认证的接口必须在请求头中携带 `Authorization: Bearer <token>`
2. Token 有效期为 7 天
3. 分页参数 `page` 从 1 开始
4. 所有时间字段使用 ISO 8601 格式
5. 文件 URL 为相对路径，需要拼接完整的服务器地址

