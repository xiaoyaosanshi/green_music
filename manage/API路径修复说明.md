# 管理后台 API 路径修复说明

## 问题描述

前端请求接口时出现 **404 错误**。

## 问题原因

前端 API 文件中的所有 URL 都包含了 `/api` 前缀，但是 `request.js` 中的 `baseURL` 在开发环境已经设置为 `/api`，这导致最终的 URL 变成了 `/api/api/admin/...`，而不是正确的 `/api/admin/...`。

### 错误的请求路径
```
baseURL: '/api'
url: '/api/admin/auth/login'
最终URL: '/api/api/admin/auth/login' ❌
```

### 正确的请求路径
```
baseURL: '/api'
url: '/admin/auth/login'
最终URL: '/api/admin/auth/login' ✅
```

## 修复内容

已修复所有前端 API 文件，去掉 URL 中的 `/api` 前缀：

### 修复的文件列表

1. ✅ `src/api/admin.js` - 管理员接口
2. ✅ `src/api/song.js` - 音乐管理接口
3. ✅ `src/api/user.js` - 用户管理接口
4. ✅ `src/api/statistics.js` - 数据统计接口
5. ✅ `src/api/album.js` - 专辑管理接口
6. ✅ `src/api/comment.js` - 评论管理接口
7. ✅ `src/api/lyric.js` - 歌词管理接口
8. ✅ `src/api/playlist.js` - 歌单管理接口
9. ✅ `src/api/log.js` - 操作日志接口
10. ✅ `src/api/upload.js` - 文件上传接口（新增）

### 修复示例

**修复前**：
```javascript
export function adminLogin(data) {
  return request({
    url: '/api/admin/auth/login',  // ❌ 包含 /api 前缀
    method: 'post',
    data
  })
}
```

**修复后**：
```javascript
export function adminLogin(data) {
  return request({
    url: '/admin/auth/login',  // ✅ 去掉 /api 前缀
    method: 'post',
    data
  })
}
```

## 请求流程（修复后）

1. **前端发起请求**：
   ```javascript
   url: '/admin/auth/login'
   baseURL: '/api' (开发环境)
   ```

2. **Vite 代理转发**：
   ```
   http://localhost:3002/api/admin/auth/login
   ↓ (Vite 代理)
   http://localhost:3001/api/admin/auth/login
   ```

3. **后端路由匹配**：
   ```
   /api (routes/index.js)
   ↓
   /admin (adminRoutes)
   ↓
   /auth/login (adminRoutes.js)
   ```

4. **请求成功** ✅

## 验证步骤

1. **重启前端服务**：
   ```bash
   cd manage
   npm run dev
   ```

2. **检查浏览器 Network**：
   - 打开开发者工具（F12）
   - 查看 Network 标签
   - 请求 URL 应该是：`http://localhost:3002/api/admin/auth/login`
   - 不应该出现 `/api/api/` 的重复路径

3. **测试登录**：
   - 访问 `http://localhost:3002`
   - 尝试登录
   - 应该不再出现 404 错误

## 新增接口

### 文件上传接口

创建了 `src/api/upload.js` 文件，提供文件上传功能：

```javascript
import { uploadFile } from '@/api/upload'

// 上传文件
const file = document.querySelector('input[type="file"]').files[0]
uploadFile(file, 'cover').then(res => {
  console.log('上传成功:', res.data.url)
})
```

## 注意事项

1. **开发环境**：使用相对路径 `/admin/...`，通过 Vite 代理转发
2. **生产环境**：如果设置了 `VITE_API_BASE_URL`，会使用完整 URL
3. **退出登录**：前端处理即可，无需调用后端接口

## 总结

✅ **所有 API 路径已修复**，现在应该可以正常访问后端接口了。

如果还有问题，请检查：
- 后端服务是否在 3001 端口运行
- Vite 代理配置是否正确
- 浏览器控制台是否有其他错误

