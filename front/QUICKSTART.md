# Green Music 前端快速启动指南

## 安装依赖

```bash
cd front
npm install
```

## 开发

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

## 构建

```bash
npm run build
```

## 项目结构说明

```
front/
├── src/
│   ├── api/              # API接口封装（已对接后端接口）
│   ├── assets/           # 静态资源
│   │   └── styles/       # 全局样式（变量、混入等）
│   ├── components/       # 公共组件
│   │   ├── MusicPlayer/  # 音乐播放器
│   │   ├── PlaylistCard/ # 歌单卡片
│   │   ├── MusicCard/    # 音乐卡片
│   │   ├── SearchBar/    # 搜索栏
│   │   └── ...
│   ├── views/            # 页面组件
│   │   ├── Home/         # 首页
│   │   ├── Discover/     # 发现页
│   │   ├── Playlist/     # 歌单详情页
│   │   ├── Search/       # 搜索页
│   │   ├── User/         # 用户中心
│   │   └── Login/         # 登录页
│   ├── router/           # 路由配置
│   ├── store/            # Pinia状态管理
│   │   ├── user.js       # 用户状态
│   │   ├── player.js     # 播放器状态
│   │   └── playlist.js   # 歌单状态
│   ├── utils/            # 工具函数
│   └── composables/      # 组合式函数
```

## 已实现功能

### 核心功能
- ✅ 用户认证（登录/登出）
- ✅ 音乐播放器（播放/暂停/上一首/下一首/音量控制/播放模式）
- ✅ 歌单管理（查看歌单列表、歌单详情）
- ✅ 搜索功能（歌曲、歌单搜索）
- ✅ 用户中心（我的歌单、播放历史、收藏）

### 页面
- ✅ 首页（推荐歌单、最新音乐、热门歌曲、个性化推荐）
- ✅ 发现页（分类浏览、排行榜）
- ✅ 歌单详情页
- ✅ 搜索页
- ✅ 用户中心
- ✅ 登录页

### 组件
- ✅ 音乐播放器组件
- ✅ 歌单卡片组件
- ✅ 音乐卡片组件
- ✅ 搜索栏组件
- ✅ 加载组件
- ✅ 用户头像组件

## API对接

所有API接口已按照后端接口文档实现：
- 用户认证：`/api/auth/login`, `/api/auth/register`
- 用户信息：`/api/me`, `/api/me/play-history`
- 歌曲：`/api/songs`, `/api/songs/:id`, `/api/songs/:id/lyrics`
- 歌单：`/api/playlists`, `/api/playlists/:id`
- 收藏：`/api/favorites/songs`
- 评论：`/api/comments`
- 推荐：`/api/recommend/personal`, `/api/recommend/hot`
- 通知：`/api/notifications`

## 环境变量

在 `.env.development` 和 `.env.production` 中配置：
- `VITE_API_BASE_URL`: API基础地址（默认：http://localhost:3001）

## 注意事项

1. 确保后端服务运行在 `http://localhost:3001`
2. 首次使用需要先登录（测试账号：testuser1 / Test123456）
3. 部分功能（如收藏、添加到歌单）需要登录后使用
4. 播放器需要音频文件URL，确保后端正确配置了文件路径

## 待完善功能

- [ ] 注册页面
- [ ] 歌单创建/编辑功能
- [ ] 评论功能完整实现
- [ ] 通知功能
- [ ] 歌词显示
- [ ] 播放列表管理优化
- [ ] 响应式适配优化

