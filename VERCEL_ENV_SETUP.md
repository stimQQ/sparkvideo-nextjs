# Vercel 环境变量配置指南

## 你需要在 Vercel 上配置的环境变量

### 必需的环境变量（仅需2个）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://api.sparkvideo.cc` | 后端 API 地址 |
| `NEXT_PUBLIC_SITE_URL` | `https://sparkvideo.cc` | 前端网站地址 |

### 可选的环境变量

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | `G-XXXXXXXXXX` | Google Analytics ID |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://xxx@sentry.io/xxx` | Sentry 错误追踪 |

## 为什么这么简单？

因为你的后端已经处理了：
- ✅ 用户认证（登录/注册）
- ✅ Token 管理
- ✅ 会话管理
- ✅ API 安全验证

前端只需要知道：
- 调用哪个 API（`NEXT_PUBLIC_API_URL`）
- 网站自己的地址（`NEXT_PUBLIC_SITE_URL`）

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

## 验证配置

部署后访问你的网站，检查：
1. API 请求是否正确指向 `https://api.sparkvideo.cc`
2. 网站是否正常运行在 `https://sparkvideo.cc`

## 注意事项

- `NEXT_PUBLIC_` 前缀的变量会暴露给客户端，这是正常的（API地址本来就是公开的）
- 所有敏感信息（如用户Token）应该由后端管理，前端通过 Cookie 或 localStorage 存储后端返回的 Token