# CORS 配置说明

## 前端配置

前端开发服务器现在运行在 **端口 3000**：

```bash
npm run dev
# 服务将运行在 http://localhost:3000
```

## 后端 CORS 配置

请确保你的后端 API 允许来自 `http://localhost:3000` 的请求。

### 后端需要添加的 CORS 头：

```javascript
// Node.js Express 示例
app.use(cors({
  origin: [
    'http://localhost:3000',      // 本地开发
    'https://sparkvideo.cc',       // 生产环境
    'https://*.vercel.app'         // Vercel 预览部署
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 或者使用更简单的配置（开发环境）：

```javascript
// 允许所有源（仅用于开发）
app.use(cors({
  origin: true,
  credentials: true
}));
```

### Python Flask 示例：

```python
from flask_cors import CORS

CORS(app, origins=[
    'http://localhost:3000',
    'https://sparkvideo.cc'
], supports_credentials=True)
```

### Go Gin 示例：

```go
import "github.com/gin-contrib/cors"

router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000", "https://sparkvideo.cc"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    AllowCredentials: true,
}))
```

## 测试 CORS

1. 启动前端开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000

3. 尝试解析视频链接，应该能正常调用 API

## 常见问题

### 问题：仍然出现 CORS 错误

**解决方案**：
1. 检查后端是否正确处理 OPTIONS 预检请求
2. 确保后端返回正确的 CORS 头
3. 检查是否有代理或防火墙阻止请求

### 问题：Cookie 无法跨域传递

**解决方案**：
1. 前端请求需要设置 `credentials: 'include'`
2. 后端需要设置 `Access-Control-Allow-Credentials: true`
3. 不能使用通配符 `*` 作为 origin

## 生产环境

生产环境部署后，记得更新后端 CORS 配置：
- 添加 `https://sparkvideo.cc` 到允许的源
- 移除 `http://localhost:3000`（如果不需要）