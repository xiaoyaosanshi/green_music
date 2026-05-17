# Green Music 管理后台 API 接口文档

## 基础信息

- **Base URL**: `http://localhost:3001`
- **API 前缀**: `/api/admin`
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

所有管理后台接口（除登录外）都需要在请求头中携带 JWT Token：

```
Authorization: Bearer <token>
```

---

## 1. 认证接口

### 1.1 管理员登录

**POST /api/admin/auth/login**

管理员登录，获取 JWT Token

**请求参数**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**响应示例**
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "super_admin"
    }
  }
}
```

### 1.2 获取管理员信息

**GET /api/admin/auth/info**

获取当前登录管理员的信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/auth/info
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "last_login_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 2. 音乐管理接口

### 2.1 获取音乐列表

**GET /api/admin/songs**

获取音乐列表（支持分页、搜索、筛选）

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（歌曲名、歌手名）
- `status`: 状态（0:下架, 1:上架）
- `genre`: 类型ID

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/songs?page=1&pageSize=20&keyword=test&status=1"
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
        "title": "歌曲名称",
        "artist_name": "歌手名称",
        "album_id": 1,
        "duration": 240,
        "play_count": 1000,
        "status": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### 2.2 获取音乐详情

**GET /api/admin/songs/:id**

获取音乐详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/songs/1
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "歌曲名称",
    "artist_id": 1,
    "artist_name": "歌手名称",
    "album_id": 1,
    "album_name": "专辑名称",
    "duration": 240,
    "file_url": "http://example.com/song.mp3",
    "cover_url": "http://example.com/cover.jpg",
    "genres": ["流行", "摇滚"],
    "play_count": 1000,
    "favorite_count": 100,
    "comment_count": 50,
    "rating": 4.5,
    "status": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.3 创建音乐

**POST /api/admin/songs**

创建新音乐

**认证**: 需要 Token

**请求参数** (multipart/form-data)
- `title`: 歌曲名称（必填）
- `artist`: 歌手名称（必填）
- `album`: 专辑名称（可选）
- `genre`: 类型（必填）
- `cover`: 封面图文件（可选，最大5MB）
- `file`: 音乐文件（必填，最大50MB）
- `release_date`: 发行时间（可选）
- `description`: 描述（可选）
- `status`: 是否上架（默认1）

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/songs \
  -H "Authorization: Bearer <token>" \
  -F "title=新歌曲" \
  -F "artist=歌手名" \
  -F "genre=pop" \
  -F "file=@/path/to/song.mp3" \
  -F "cover=@/path/to/cover.jpg"
```

**响应示例**
```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "songId": 1
  }
}
```

### 2.4 更新音乐

**PUT /api/admin/songs/:id**

更新音乐信息

**认证**: 需要 Token

**请求参数** (multipart/form-data，所有字段可选)
- `title`: 歌曲名称
- `artist`: 歌手名称
- `album`: 专辑名称
- `genre`: 类型
- `cover`: 封面图文件
- `file`: 音乐文件（可选，替换音乐文件）
- `release_date`: 发行时间
- `description`: 描述
- `status`: 是否上架

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/songs/1 \
  -H "Authorization: Bearer <token>" \
  -F "title=更新后的歌曲名" \
  -F "status=1"
```

**响应示例**
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "更新后的歌曲名"
  }
}
```

### 2.5 删除音乐

**DELETE /api/admin/songs/:id**

删除音乐（软删除）

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/songs/1 \
  -H "Authorization: Bearer <token>"
```

**响应示例**
```json
{
  "code": 0,
  "message": "删除成功",
  "data": null
}
```

### 2.6 上架/下架音乐

**PUT /api/admin/songs/:id/status**

上架或下架音乐

**认证**: 需要 Token

**请求参数**
```json
{
  "status": 1  // 1:上架, 0:下架
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/songs/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":0}'
```

**响应示例**
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "songId": 1,
    "status": 0
  }
}
```

### 2.7 批量操作音乐

**POST /api/admin/songs/batch**

批量操作音乐（删除、上架、下架、修改类型等）

**认证**: 需要 Token

**请求参数**
```json
{
  "ids": [1, 2, 3],
  "action": "delete",  // delete:删除, online:上架, offline:下架, update_genre:修改类型
  "data": {}  // 批量操作时的额外数据（如批量修改类型时的genreIds）
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/songs/batch \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ids":[1,2,3],"action":"delete"}'
```

**响应示例**
```json
{
  "code": 0,
  "message": "批量操作成功",
  "data": {
    "success_count": 3,
    "fail_count": 0
  }
}
```

---

## 3. 专辑管理接口

### 3.1 获取专辑列表

**GET /api/admin/albums**

获取专辑列表

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（专辑名、歌手名）
- `artist_id`: 歌手ID

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/albums?page=1&pageSize=20"
```

### 3.2 获取专辑详情

**GET /api/admin/albums/:id**

获取专辑详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/albums/1
```

### 3.3 创建专辑

**POST /api/admin/albums**

创建新专辑

**认证**: 需要 Token

**请求参数**
```json
{
  "title": "专辑名称",
  "artist_id": 1,
  "cover_url": "http://example.com/cover.jpg",
  "release_date": "2024-01-01",
  "description": "专辑描述",
  "song_ids": [1, 2, 3]
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/albums \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新专辑",
    "artist_id": 1,
    "song_ids": [1, 2, 3]
  }'
```

### 3.4 更新专辑

**PUT /api/admin/albums/:id**

更新专辑信息

**认证**: 需要 Token

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/albums/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"更新后的专辑名"}'
```

### 3.5 删除专辑

**DELETE /api/admin/albums/:id**

删除专辑

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/albums/1 \
  -H "Authorization: Bearer <token>"
```

---

## 4. 歌词管理接口

### 4.1 获取歌词列表

**GET /api/admin/lyrics**

获取歌词列表（用于审核）

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（歌曲名）
- `song_id`: 歌曲ID
- `status`: 审核状态（pending:待审核, approved:已通过, rejected:已拒绝）
- `type`: 歌词类型（official:官方, user_upload:用户上传）

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/lyrics?page=1&pageSize=20&status=pending"
```

### 4.2 上传官方歌词

**POST /api/admin/lyrics**

管理员上传官方歌词

**认证**: 需要 Token

**请求参数**
```json
{
  "song_id": 1,
  "content": "[00:00.00]歌词内容...",
  "language": "zh"
}
```

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/lyrics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "song_id": 1,
    "content": "[00:00.00]歌词内容",
    "language": "zh"
  }'
```

### 4.3 审核歌词

**PUT /api/admin/lyrics/:id/review**

审核用户上传的歌词

**认证**: 需要 Token

**请求参数**
```json
{
  "status": "approved",  // approved:通过, rejected:拒绝
  "reason": "拒绝原因"  // 拒绝时必填
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/lyrics/1/review \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

### 4.4 删除歌词

**DELETE /api/admin/lyrics/:id**

删除歌词

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/lyrics/1 \
  -H "Authorization: Bearer <token>"
```

---

## 5. 用户管理接口

### 5.1 获取用户列表

**GET /api/admin/users**

获取用户列表

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（用户名、昵称、邮箱）
- `status`: 状态（0:禁用, 1:正常）

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/users?page=1&pageSize=20&status=1"
```

### 5.2 获取用户详情

**GET /api/admin/users/:id**

获取用户详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/users/1
```

### 5.3 禁用/启用用户

**PUT /api/admin/users/:id/status**

禁用或启用用户

**认证**: 需要 Token

**请求参数**
```json
{
  "status": 0  // 0:禁用, 1:启用
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/users/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":0}'
```

### 5.4 重置用户密码

**POST /api/admin/users/:id/reset-password**

重置用户密码（生成重置Token）

**认证**: 需要 Token

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/users/1/reset-password \
  -H "Authorization: Bearer <token>"
```

**响应示例**
```json
{
  "code": 0,
  "message": "密码重置成功，已发送重置链接到用户邮箱",
  "data": {
    "reset_token": "reset_token_here",
    "email": "user@example.com"
  }
}
```

### 5.5 删除用户

**DELETE /api/admin/users/:id**

删除用户（软删除）

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/users/1 \
  -H "Authorization: Bearer <token>"
```

---

## 6. 评论管理接口

### 6.1 获取评论列表

**GET /api/admin/comments**

获取评论列表

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（评论内容、歌曲名、用户名）
- `review_status`: 审核状态（normal:正常, pending:待审核, deleted:已删除）
- `song_id`: 歌曲ID

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/comments?page=1&pageSize=20&review_status=pending"
```

### 6.2 获取评论详情

**GET /api/admin/comments/:id**

获取评论详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/comments/1
```

### 6.3 审核评论

**PUT /api/admin/comments/:id/review**

审核评论

**认证**: 需要 Token

**请求参数**
```json
{
  "status": "normal"  // normal:通过, deleted:删除
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/comments/1/review \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"normal"}'
```

### 6.4 删除评论

**DELETE /api/admin/comments/:id**

删除评论

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/comments/1 \
  -H "Authorization: Bearer <token>"
```

---

## 7. 歌单管理接口

### 7.1 获取歌单列表

**GET /api/admin/playlists**

获取歌单列表

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（歌单名、创建者）
- `is_public`: 是否公开（0:私密, 1:公开）
- `user_id`: 创建者ID

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/playlists?page=1&pageSize=20"
```

### 7.2 获取歌单详情

**GET /api/admin/playlists/:id**

获取歌单详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/playlists/1
```

### 7.3 更新歌单

**PUT /api/admin/playlists/:id**

更新歌单信息

**认证**: 需要 Token

**请求参数**
```json
{
  "name": "歌单名称",
  "description": "歌单描述",
  "cover_url": "http://example.com/cover.jpg",
  "is_public": 1,
  "song_ids": [1, 2, 3]
}
```

**请求示例**
```bash
curl -X PUT http://localhost:3001/api/admin/playlists/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"更新后的歌单名"}'
```

### 7.4 删除歌单

**DELETE /api/admin/playlists/:id**

删除歌单

**认证**: 需要 Token

**请求示例**
```bash
curl -X DELETE http://localhost:3001/api/admin/playlists/1 \
  -H "Authorization: Bearer <token>"
```

---

## 8. 数据统计接口

### 8.1 获取数据统计概览

**GET /api/admin/statistics**

获取系统数据统计概览

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/statistics
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalUsers": 1000,
    "todayNewUsers": 10,
    "totalSongs": 5000,
    "todayNewSongs": 5,
    "totalPlayback": 100000,
    "todayPlayback": 1000,
    "totalComments": 500,
    "todayNewComments": 10,
    "totalPlaylists": 200,
    "todayNewPlaylists": 5
  }
}
```

### 8.2 获取用户统计

**GET /api/admin/statistics/users**

获取用户统计数据

**认证**: 需要 Token

**请求参数**
- `start_date`: 开始日期（可选）
- `end_date`: 结束日期（可选）
- `period`: 统计周期（day/week/month，默认day）

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/statistics/users?period=day"
```

### 8.3 获取音乐统计

**GET /api/admin/statistics/songs**

获取音乐统计数据

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/statistics/songs
```

### 8.4 获取播放统计

**GET /api/admin/statistics/playback**

获取播放统计数据

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/statistics/playback
```

### 8.5 获取推荐统计

**GET /api/admin/statistics/recommend**

获取推荐算法效果统计

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/statistics/recommend
```

---

## 9. 操作日志接口

### 9.1 获取操作日志列表

**GET /api/admin/logs**

获取操作日志列表

**认证**: 需要 Token

**请求参数**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `keyword`: 关键词（操作内容）
- `admin_id`: 管理员ID
- `action_type`: 操作类型（create/update/delete/review）
- `target_type`: 操作对象类型（song/user/comment等）
- `start_date`: 开始日期
- `end_date`: 结束日期

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/admin/logs?page=1&pageSize=20"
```

### 9.2 获取日志详情

**GET /api/admin/logs/:id**

获取操作日志详细信息

**认证**: 需要 Token

**请求示例**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/logs/1
```

---

## 10. 文件上传接口

### 10.1 上传文件

**POST /api/admin/upload**

上传文件（封面图、音乐文件、歌词文件等）

**认证**: 需要 Token

**请求参数** (multipart/form-data)
- `file`: 文件（必填）
- `type`: 文件类型（cover/music/lyric，可选）

**请求示例**
```bash
curl -X POST http://localhost:3001/api/admin/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.jpg"
```

**响应示例**
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "/uploads/file.jpg",
    "path": "./uploads/file.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| AUTH_INVALID_CREDENTIALS | 账号或密码错误 |
| AUTH_TOKEN_INVALID | Token无效 |
| AUTH_TOKEN_MISSING | Token缺失 |
| FORBIDDEN | 无权限访问 |
| NOT_FOUND | 资源不存在 |
| VALIDATION_ERROR | 参数验证失败 |
| INTERNAL_ERROR | 服务器内部错误 |

---

## 注意事项

1. **Token有效期**: 管理员Token有效期为7天
2. **文件上传限制**:
   - 封面图：最大5MB，支持JPG、PNG格式
   - 音乐文件：最大50MB，支持MP3、WAV、FLAC格式
   - 歌词文件：最大1MB，支持LRC格式
3. **分页**: 所有列表接口都支持分页，默认每页20条
4. **权限**: 所有接口都需要管理员身份验证
5. **操作日志**: 重要操作会自动记录到操作日志表（如果表存在）

---

**文档版本**: v1.0  
**最后更新**: 2024-01-XX

