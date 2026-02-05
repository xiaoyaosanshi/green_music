# Green Music 后端服务

基于 Express + MySQL 的在线音乐平台后端服务。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 3. 初始化数据库

执行数据库迁移脚本（需要先创建数据库）：

```sql
CREATE DATABASE green_music CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后执行 `后端实现方案.md` 中的 SQL 脚本创建表结构。

### 4. 启动服务

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## 项目结构

```
node/
├── config/          # 配置文件
├── controllers/     # 控制器层
├── services/        # 服务层
├── routes/          # 路由定义
├── middleware/      # 中间件
├── utils/           # 工具函数
├── algorithms/      # 推荐算法
├── workers/         # 后台任务
└── app.js          # 应用入口
```

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户接口

- `GET /api/me` - 获取当前用户信息
- `PATCH /api/me` - 更新用户信息
- `GET /api/me/play-history` - 获取播放历史

### 歌曲接口

- `GET /api/songs` - 获取歌曲列表
- `GET /api/songs/:id` - 获取歌曲详情
- `GET /api/songs/:id/lyrics` - 获取歌词

### 推荐接口

- `GET /api/recommend/personal` - 个性化推荐（需认证）
- `GET /api/recommend/hot` - 热门推荐
- `GET /api/recommend/similar/:songId` - 相似推荐

更多接口请参考 `后端实现方案.md`。

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 RESTful API 设计规范
- 统一错误处理和响应格式

## 许可证

MIT

