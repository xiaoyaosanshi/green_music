# 管理后台接口 curl 测试命令

## 前置条件

1. **启动后端服务**:
```bash
cd node
npm start
```

2. **确保数据库已初始化并包含管理员账号**:
   - 默认管理员: `admin` / `Admin123456`
   - 或执行: `node migrations/init_mock_users.js`

---

## 测试步骤

### 步骤 1: 管理员登录（获取 Token）

```bash
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123456"}'
```

**预期响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@greenmusic.com",
      "role": "super_admin"
    }
  }
}
```

**保存 Token** (将返回的token保存到变量):
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 步骤 2: 获取管理员信息

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/auth/info
```

---

### 步骤 3: 数据统计接口

#### 3.1 获取数据统计概览
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics
```

#### 3.2 获取用户统计
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/statistics/users?period=day"
```

#### 3.3 获取音乐统计
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics/songs
```

#### 3.4 获取播放统计
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics/playback
```

#### 3.5 获取推荐统计
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics/recommend
```

---

### 步骤 4: 音乐管理接口

#### 4.1 获取音乐列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/songs?page=1&pageSize=10"
```

#### 4.2 搜索音乐
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/songs?keyword=周杰伦&page=1&pageSize=10"
```

#### 4.3 按状态筛选
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/songs?status=1&page=1&pageSize=10"
```

#### 4.4 获取音乐详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/songs/1
```

#### 4.5 上架音乐
```bash
curl -X PUT http://localhost:3001/api/admin/songs/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":1}'
```

#### 4.6 下架音乐
```bash
curl -X PUT http://localhost:3001/api/admin/songs/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":0}'
```

#### 4.7 批量删除音乐
```bash
curl -X POST http://localhost:3001/api/admin/songs/batch \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids":[1,2,3],"action":"delete"}'
```

#### 4.8 批量上架音乐
```bash
curl -X POST http://localhost:3001/api/admin/songs/batch \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids":[1,2,3],"action":"online"}'
```

#### 4.9 更新音乐信息
```bash
curl -X PUT http://localhost:3001/api/admin/songs/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的歌曲名",
    "status": 1
  }'
```

#### 4.10 删除音乐
```bash
curl -X DELETE http://localhost:3001/api/admin/songs/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 5: 专辑管理接口

#### 5.1 获取专辑列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/albums?page=1&pageSize=10"
```

#### 5.2 获取专辑详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/albums/1
```

#### 5.3 创建专辑
```bash
curl -X POST http://localhost:3001/api/admin/albums \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新专辑",
    "artist_id": 1,
    "release_date": "2024-01-01",
    "description": "专辑描述",
    "song_ids": [1, 2, 3]
  }'
```

#### 5.4 更新专辑
```bash
curl -X PUT http://localhost:3001/api/admin/albums/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的专辑名",
    "description": "更新后的描述"
  }'
```

#### 5.5 删除专辑
```bash
curl -X DELETE http://localhost:3001/api/admin/albums/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 6: 歌词管理接口

#### 6.1 获取歌词列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/lyrics?page=1&pageSize=10"
```

#### 6.2 获取待审核歌词
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/lyrics?status=pending&page=1&pageSize=10"
```

#### 6.3 上传官方歌词
```bash
curl -X POST http://localhost:3001/api/admin/lyrics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "song_id": 1,
    "content": "[00:00.00]第一句歌词\n[00:05.00]第二句歌词",
    "language": "zh"
  }'
```

#### 6.4 审核歌词（通过）
```bash
curl -X PUT http://localhost:3001/api/admin/lyrics/1/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

#### 6.5 审核歌词（拒绝）
```bash
curl -X PUT http://localhost:3001/api/admin/lyrics/1/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "reason": "歌词内容不符合规范"
  }'
```

#### 6.6 删除歌词
```bash
curl -X DELETE http://localhost:3001/api/admin/lyrics/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 7: 用户管理接口

#### 7.1 获取用户列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/users?page=1&pageSize=10"
```

#### 7.2 搜索用户
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/users?keyword=test&page=1&pageSize=10"
```

#### 7.3 获取用户详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/users/1
```

#### 7.4 禁用用户
```bash
curl -X PUT http://localhost:3001/api/admin/users/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":0}'
```

#### 7.5 启用用户
```bash
curl -X PUT http://localhost:3001/api/admin/users/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":1}'
```

#### 7.6 重置用户密码
```bash
curl -X POST http://localhost:3001/api/admin/users/1/reset-password \
  -H "Authorization: Bearer $TOKEN"
```

#### 7.7 删除用户
```bash
curl -X DELETE http://localhost:3001/api/admin/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 8: 评论管理接口

#### 8.1 获取评论列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/comments?page=1&pageSize=10"
```

#### 8.2 获取待审核评论
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/comments?review_status=pending&page=1&pageSize=10"
```

#### 8.3 获取评论详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/comments/1
```

#### 8.4 审核评论（通过）
```bash
curl -X PUT http://localhost:3001/api/admin/comments/1/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"normal"}'
```

#### 8.5 删除评论
```bash
curl -X DELETE http://localhost:3001/api/admin/comments/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 9: 歌单管理接口

#### 9.1 获取歌单列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/playlists?page=1&pageSize=10"
```

#### 9.2 获取歌单详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/playlists/1
```

#### 9.3 更新歌单
```bash
curl -X PUT http://localhost:3001/api/admin/playlists/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新后的歌单名",
    "description": "更新后的描述",
    "is_public": 1
  }'
```

#### 9.4 删除歌单
```bash
curl -X DELETE http://localhost:3001/api/admin/playlists/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 步骤 10: 操作日志接口

#### 10.1 获取操作日志列表
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/logs?page=1&pageSize=10"
```

#### 10.2 按操作类型筛选
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/logs?action_type=create&page=1&pageSize=10"
```

#### 10.3 按时间范围筛选
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/logs?start_date=2024-01-01&end_date=2024-01-31&page=1&pageSize=10"
```

#### 10.4 获取日志详情
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/logs/1
```

---

### 步骤 11: 文件上传接口

#### 11.1 上传文件
```bash
curl -X POST http://localhost:3001/api/admin/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/file.jpg"
```

**Windows 路径示例**:
```bash
curl -X POST http://localhost:3001/api/admin/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@D:/path/to/file.jpg"
```

---

## 完整测试流程示例

### 方式一：使用变量保存 Token

```bash
# 1. 登录并保存 Token
RESPONSE=$(curl -s -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123456"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. 使用 Token 测试接口
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/admin/songs?page=1&pageSize=5"
```

### 方式二：直接复制 Token

1. 先执行登录命令，复制返回的 token
2. 将 token 替换到后续命令中

```bash
# 登录
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123456"}'

# 使用返回的 token（替换 YOUR_TOKEN_HERE）
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/admin/statistics
```

---

## 测试检查清单

- [ ] 后端服务已启动（端口 3001）
- [ ] 数据库已初始化
- [ ] 管理员账号已创建
- [ ] 登录接口测试通过
- [ ] 获取 Token 成功
- [ ] 使用 Token 访问其他接口

---

## 常见问题

### Q: 如何格式化 JSON 响应？

**A**: 使用 `jq` 或 `python -m json.tool`:

```bash
# 使用 jq
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics | jq

# 使用 python
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics | python -m json.tool
```

### Q: 如何查看详细的请求和响应？

**A**: 使用 `-v` 参数:

```bash
curl -v -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics
```

### Q: 如何保存响应到文件？

**A**: 使用 `-o` 参数:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/statistics \
  -o response.json
```

---

## 快速测试脚本

创建一个文件 `quick_test.sh`:

```bash
#!/bin/bash
BASE_URL="http://localhost:3001"

# 登录
echo "1. 登录..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123456"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "登录失败"
  exit 1
fi

echo "Token: ${TOKEN:0:50}..."
echo ""

# 测试接口
echo "2. 获取统计..."
curl -s -H "Authorization: Bearer $TOKEN" \
  ${BASE_URL}/api/admin/statistics | python -m json.tool

echo ""
echo "3. 获取音乐列表..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/admin/songs?page=1&pageSize=3" | python -m json.tool
```

运行:
```bash
chmod +x quick_test.sh
./quick_test.sh
```

