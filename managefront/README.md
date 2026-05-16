# Green Music 后台管理系统

## 项目简介

Green Music 后台管理系统是面向平台管理员的内容管理和数据统计分析平台。

## 技术栈

- **前端框架**: Vue 3.x (Composition API)
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4.x
- **HTTP请求**: Axios
- **构建工具**: Vite
- **样式**: SCSS
- **图表库**: ECharts

## 项目结构

```
manage/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── views/             # 页面组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── composables/       # 组合式函数
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json
├── vite.config.js
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 环境变量

创建 `.env` 文件：

```
VITE_API_BASE_URL=http://localhost:3001
```

## 功能模块

- 登录认证
- 仪表盘
- 音乐管理
- 专辑管理
- 歌词管理
- 用户管理
- 评论管理
- 歌单管理
- 数据统计
- 系统配置
- 操作日志

