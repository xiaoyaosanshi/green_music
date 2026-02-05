# Green Music API 使用指南

## 快速开始

### 1. 获取 Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identity":"testuser1","password":"Test123456"}'
```

响应中获取 `token` 字段的值。

### 2. 使用 Token 访问接口

```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/me
```

## 完整接口文档

详细接口文档请查看：[API接口文档.md](./API接口文档.md)

## 测试脚本

运行测试脚本验证所有接口：

```bash
bash 接口测试脚本.sh
```

## 接口列表

### 公开接口（无需 Token）
- ✅ GET /health - 健康检查
- ✅ POST /api/auth/login - 用户登录
- ✅ GET /api/songs - 获取歌曲列表
- ✅ GET /api/songs/:id - 获取歌曲详情
- ✅ GET /api/songs/:id/lyrics - 获取歌词
- ✅ GET /api/comments - 获取评论列表
- ✅ GET /api/recommend/hot - 获取热门推荐

### 需要认证的接口（需要 Token）
- ✅ GET /api/me - 获取当前用户信息
- ✅ GET /api/me/play-history - 获取播放历史
- ✅ GET /api/playlists - 获取歌单列表
- ✅ GET /api/notifications - 获取通知列表
- ✅ GET /api/recommend/personal - 获取个性化推荐

## 测试账号

- **用户名**: testuser1
- **密码**: Test123456

## 验证结果

所有接口已验证通过，详细结果请查看：[接口验证报告.md](./接口验证报告.md)

