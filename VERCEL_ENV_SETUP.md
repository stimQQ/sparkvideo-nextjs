# Vercel 环境变量配置指南

## 你需要在 Vercel 上配置的环境变量

### 必需的环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://api.sparkvideo.cc` | 后端 API 地址 |
| `NEXT_PUBLIC_SITE_URL` | `https://sparkvideo.cc` | 前端网站地址 |
| `NEXTAUTH_URL` | `https://sparkvideo.cc` | NextAuth 认证 URL |
| `JWT_SECRET` | 生成随机字符串 | JWT 签名密钥 |
| `NEXTAUTH_SECRET` | 生成随机字符串 | NextAuth 加密密钥 |

### 可选的环境变量

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `DATABASE_URL` | `postgresql://...` | 数据库连接字符串 |
| `REDIS_URL` | `redis://...` | Redis 缓存连接 |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | `G-XXXXXXXXXX` | Google Analytics ID |

## 如何在 Vercel 上配置

1. **登录 Vercel 并进入项目**
   - 访问 https://vercel.com
   - 选择你的项目

2. **进入设置页面**
   - 点击 "Settings" 标签
   - 选择 "Environment Variables"

3. **添加环境变量**
   - 点击 "Add Variable"
   - 输入变量名和值
   - 选择环境：
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **保存并重新部署**
   - 点击 "Save"
   - 触发重新部署以应用新配置

## 生成随机密钥

在终端运行以下命令生成安全的随机密钥：

```bash
# macOS/Linux
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 验证配置

部署后访问你的网站，检查：
1. API 请求是否正确指向 `https://api.sparkvideo.cc`
2. 网站是否正常运行在 `https://sparkvideo.cc`

## 注意事项

- `NEXT_PUBLIC_` 前缀的变量会暴露给客户端，请勿放置敏感信息
- 生产环境的密钥请使用强随机字符串
- 定期更新密钥以保证安全性