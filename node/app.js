const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// 安全中间件
app.use(helmet());
// CORS配置 - 支持多个前端源
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3002'];

app.use(cors({
  origin: function (origin, callback) {
    // 允许没有origin的请求（如移动应用、Postman等）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 日志
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static('uploads'));
}

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

// 错误处理（必须放在最后）
app.use(errorHandler);

module.exports = app;

