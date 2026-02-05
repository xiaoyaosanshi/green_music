# Green Music 前端项目

## 技术栈

- Vue 3.x (Composition API)
- Vite
- Vue Router 4.x
- Pinia
- Element Plus
- Axios
- SCSS

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

## 项目结构

```
src/
├── api/              # API接口封装
├── assets/           # 静态资源
├── components/       # 公共组件
├── views/            # 页面组件
├── router/           # 路由配置
├── store/            # 状态管理
├── utils/            # 工具函数
├── composables/      # 组合式函数
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 环境变量

- `VITE_API_BASE_URL`: API基础地址
- `VITE_APP_TITLE`: 应用标题

