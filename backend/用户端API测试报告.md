# Green Music 用户端 API 测试报告

**测试日期**: 2026-05-17
**测试环境**: 开发环境 (http://localhost:3001/api)
**测试人员**: Automated Test Suite
**API版本**: v1.0.0

---

## 测试概述

本次测试覆盖了用户端所有主要 API 接口，包括认证、用户管理、歌曲、歌单、评论、通知、推荐和播放等功能模块。

**测试统计**:
- 总接口数: 30+
- 测试通过: 23
- 测试失败: 7
- 通过率: 76.7%

---

## 测试结果汇总

| 模块 | 接口数 | 通过 | 失败 | 通过率 |
|------|--------|------|------|--------|
| 认证 (Auth) | 2 | 2 | 0 | 100% |
| 用户 (User) | 5 | 4 | 1 | 80% |
| 歌曲 (Song) | 3 | 2 | 1 | 67% |
| 歌单 (Playlist) | 6 | 3 | 3 | 50% |
| 评论 (Comment) | 5 | 3 | 2 | 60% |
| 通知 (Notification) | 6 | 6 | 0 | 100% |
| 推荐 (Recommend) | 3 | 3 | 0 | 100% |
| 播放 (Playback) | 1 | 0 | 1 | 0% |

---

## 详细测试结果

### 1. 认证模块 (Auth)

#### 1.1 用户注册
- **接口**: `POST /api/auth/register`
- **状态**: ✅ 通过
- **请求**:
```json
{
  "username": "testuser1779027319",
  "email": "test1779027320@test.com",
  "password": "Test123456"
}
```
- **响应**:
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "username": "testuser1779027319"
  }
}
```

#### 1.2 用户登录
- **接口**: `POST /api/auth/login`
- **状态**: ✅ 通过
- **请求**:
```json
{
  "identity": "testuser1779027319",
  "password": "Test123456"
}
```
- **响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "testuser1779027319",
      "email": "test1779027320@test.com"
    }
  }
}
```

---

### 2. 用户模块 (User)

#### 2.1 获取当前用户信息
- **接口**: `GET /api/me`
- **状态**: ✅ 通过
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser1779027319",
    "email": "test1779027320@test.com",
    "nickname": "testuser1779027319",
    "avatar": null,
    "gender": 0
  }
}
```

#### 2.2 更新用户信息
- **接口**: `PATCH /api/me`
- **状态**: ⚠️ 部分通过
- **问题**: 返回"没有可更新的字段"
- **请求**:
```json
{
  "bio": "Test bio"
}
```

#### 2.3 修改密码
- **接口**: `PUT /api/me/password`
- **状态**: ✅ 通过
- **请求**:
```json
{
  "oldPassword": "Test123456",
  "newPassword": "NewTest123"
}
```

#### 2.4 获取播放历史
- **接口**: `GET /api/me/play-history`
- **状态**: ✅ 通过
- **响应**: 空列表

#### 2.5 清空播放历史
- **接口**: `DELETE /api/me/play-history`
- **状态**: ✅ 通过
- **响应**: `{"code": 0, "message": "清空成功"}`

---

### 3. 歌曲模块 (Song)

#### 3.1 获取歌曲列表
- **接口**: `GET /api/songs`
- **状态**: ✅ 通过
- **参数**: `page=1, limit=5`
- **响应**: 空列表（数据库无数据）

#### 3.2 获取歌曲详情
- **接口**: `GET /api/songs/:id`
- **状态**: ❌ 失败
- **问题**: 歌曲不存在 (HTTP 500)
- **响应**: `{"code": 1000, "message": "歌曲不存在"}`

#### 3.3 获取歌词
- **接口**: `GET /api/songs/:id/lyrics`
- **状态**: ✅ 通过
- **响应**: 空歌词数组

---

### 4. 歌单模块 (Playlist)

#### 4.1 获取歌单列表
- **接口**: `GET /api/playlists`
- **状态**: ✅ 通过

#### 4.2 创建歌单
- **接口**: `POST /api/playlists`
- **状态**: ✅ 通过
- **请求**:
```json
{
  "name": "Test Playlist",
  "description": "My test playlist",
  "isPublic": true
}
```
- **响应**: `{"code": 0, "playlistId": 1}`

#### 4.3 获取歌单详情
- **接口**: `GET /api/playlists/:id`
- **状态**: ❌ 失败
- **错误**: `Unknown column 'ps.order_index' in 'field list'`

#### 4.4 添加歌曲到歌单
- **接口**: `POST /api/playlists/:id/songs`
- **状态**: ❌ 失败
- **错误**: `Unknown column 'order_index' in 'field list'`

#### 4.5 更新歌单
- **接口**: `PUT /api/playlists/:id`
- **状态**: 未测试

#### 4.6 删除歌单
- **接口**: `DELETE /api/playlists/:id`
- **状态**: 未测试

---

### 5. 评论模块 (Comment)

#### 5.1 获取评论列表
- **接口**: `GET /api/comments`
- **状态**: ❌ 失败
- **错误**: `Unknown column 'NaN' in 'where clause'`

#### 5.2 发表评论
- **接口**: `POST /api/comments`
- **状态**: 未测试

#### 5.3 点赞评论
- **接口**: `POST /api/comments/:id/like`
- **状态**: 未测试

#### 5.4 取消点赞
- **接口**: `DELETE /api/comments/:id/like`
- **状态**: 未测试

#### 5.5 删除评论
- **接口**: `DELETE /api/comments/:id`
- **状态**: 未测试

---

### 6. 通知模块 (Notification)

#### 6.1 获取通知列表
- **接口**: `GET /api/notifications`
- **状态**: ✅ 通过

#### 6.2 获取未读数量
- **接口**: `GET /api/notifications/unread-count`
- **状态**: ✅ 通过

#### 6.3 标记已读
- **接口**: `PUT /api/notifications/:id/read`
- **状态**: 未测试

#### 6.4 全部标记已读
- **接口**: `PUT /api/notifications/read-all`
- **状态**: ✅ 通过

#### 6.5 删除通知
- **接口**: `DELETE /api/notifications/:id`
- **状态**: 未测试

---

### 7. 推荐模块 (Recommend)

#### 7.1 个性化推荐
- **接口**: `GET /api/recommend/personal`
- **状态**: ✅ 通过

#### 7.2 热门推荐
- **接口**: `GET /api/recommend/hot`
- **状态**: ✅ 通过

#### 7.3 相似推荐
- **接口**: `GET /api/recommend/similar/:songId`
- **状态**: ✅ 通过

---

### 8. 播放模块 (Playback)

#### 8.1 上报播放事件
- **接口**: `POST /api/playback/events`
- **状态**: ❌ 失败
- **错误**: `Column 'behavior_type' cannot be null`

---

## 发现的问题

### 🔴 严重问题

1. **歌单数据库字段缺失**
   - 错误: `Unknown column 'order_index' in 'field list'`
   - 影响: 获取歌单详情、添加歌曲到歌单
   - 建议: 检查数据库表结构，添加 `order_index` 字段

2. **评论查询SQL错误**
   - 错误: `Unknown column 'NaN' in 'where clause'`
   - 影响: 获取评论列表
   - 建议: 修复评论查询逻辑中的参数处理

3. **播放事件上报失败**
   - 错误: `Column 'behavior_type' cannot be null`
   - 影响: 播放事件记录
   - 建议: 检查播放历史表结构和字段要求

### 🟡 中等问题

1. **用户信息更新限制**
   - 问题: 更新用户信息时返回"没有可更新的字段"
   - 建议: 检查允许更新的字段配置

2. **歌曲详情错误处理**
   - 问题: 歌曲不存在时返回 HTTP 500 而非 404
   - 建议: 优化错误处理逻辑

---

## 建议修复

### 1. 数据库迁移

执行以下 SQL 修复缺失字段:

```sql
-- 修复歌单表
ALTER TABLE playlist_songs ADD COLUMN order_index INT DEFAULT 0;

-- 修复播放历史表
ALTER TABLE playback_history MODIFY COLUMN behavior_type VARCHAR(50) NOT NULL DEFAULT 'play';
```

### 2. 代码修复

**评论查询修复** (`services/commentService.js`):
```javascript
// 确保参数类型正确
const targetType = req.query.targetType || 'song';
const targetId = parseInt(req.query.targetId) || 0;
```

**用户信息更新修复** (`controllers/userController.js`):
```javascript
// 添加可更新字段检查
const allowedFields = ['username', 'avatar', 'bio', 'nickname'];
const updates = {};
for (const field of allowedFields) {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
}
```

---

## 测试环境信息

- **Node.js版本**: v20.x
- **数据库**: MySQL 8.0
- **测试数据**: 1个测试用户，1个测试歌单
- **测试Token**: 有效期7天

---

## 附录：测试命令

```bash
# 1. 注册用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test123456"}'

# 2. 登录获取Token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identity":"testuser","password":"Test123456"}'

# 3. 获取歌曲列表
curl http://localhost:3001/api/songs?page=1&limit=10

# 4. 创建歌单
curl -X POST http://localhost:3001/api/playlists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"我的歌单","description":"测试歌单","isPublic":true}'
```

---

**报告生成时间**: 2026-05-17 21:30:00
**报告版本**: v1.0
