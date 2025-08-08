# Vercel 部署指南

## 快速部署步骤

### 1. 通过 Vercel 网站部署（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 GitHub 仓库 `sparkvideo-nextjs`
   - 点击 "Import"

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_API_BASE_URL = https://your-api-domain.com/api
   NEXT_PUBLIC_SITE_URL = https://your-site-domain.vercel.app
   ```

4. **部署设置**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build` (自动检测)
   - Output Directory: `.next` (自动检测)
   - Install Command: `npm install` (自动检测)

5. **点击 Deploy**
   等待部署完成，通常需要 2-3 分钟

### 2. 通过 CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   
   # 生产环境部署
   vercel --prod
   ```

4. **设置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL
   vercel env add NEXT_PUBLIC_SITE_URL
   ```

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 地址 | `https://api.sparkvideo.com/api` |
| `NEXT_PUBLIC_SITE_URL` | 前端站点地址 | `https://sparkvideo.vercel.app` |

### 可选的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | `your-google-client-id` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | `GTM-XXXXXXX` |

## GitHub Actions 自动部署

### 配置步骤

1. **获取 Vercel Token**
   - 访问 [Vercel Account Settings](https://vercel.com/account/tokens)
   - 创建新的 Token
   - 复制 Token 值

2. **获取项目 ID**
   在 Vercel 项目设置中找到：
   - `VERCEL_ORG_ID`: Settings > General > Team ID
   - `VERCEL_PROJECT_ID`: Settings > General > Project ID

3. **配置 GitHub Secrets**
   在 GitHub 仓库设置中添加：
   - `VERCEL_TOKEN`: Vercel Token
   - `VERCEL_ORG_ID`: Team/Org ID
   - `VERCEL_PROJECT_ID`: Project ID

4. **自动部署已配置**
   - 推送到 `main` 分支自动部署到生产环境
   - Pull Request 自动创建预览部署

## 域名配置

### 添加自定义域名

1. **在 Vercel 项目设置中**
   - 进入 Settings > Domains
   - 添加域名 (如: `sparkvideo.com`)

2. **DNS 配置**
   
   **方式一：使用 CNAME（推荐）**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   **方式二：使用 A 记录**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

3. **SSL 证书**
   - Vercel 自动提供 SSL 证书
   - 等待 DNS 生效后自动配置

## 性能优化配置

### 已配置的优化

1. **区域部署**
   - 香港 (hkg1)
   - 新加坡 (sin1)

2. **缓存策略**
   - 静态资源：31536000 秒
   - API 路由：无缓存
   - 页面：按需重新验证

3. **安全头**
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Referrer-Policy

## 监控和分析

### Vercel Analytics

1. 在项目中启用 Analytics
2. 查看实时访问数据
3. 性能指标监控

### 日志查看

```bash
# 查看函数日志
vercel logs

# 查看构建日志
vercel logs --build
```

## 常见问题

### 1. 构建失败

**问题**: `Module not found`
**解决**: 确保所有依赖都在 `package.json` 中

### 2. 环境变量未生效

**问题**: 环境变量在生产环境不工作
**解决**: 
- 确保使用 `NEXT_PUBLIC_` 前缀
- 重新部署项目

### 3. 图片加载失败

**问题**: 外部图片无法加载
**解决**: 在 `next.config.ts` 中配置图片域名

### 4. API 跨域问题

**问题**: CORS 错误
**解决**: 
- 检查后端 CORS 配置
- 确保 API URL 正确

## 回滚部署

如需回滚到之前的版本：

1. **通过 Vercel Dashboard**
   - 进入 Deployments
   - 找到之前的部署
   - 点击 "Promote to Production"

2. **通过 CLI**
   ```bash
   vercel rollback
   ```

## 联系支持

- Vercel 文档: [vercel.com/docs](https://vercel.com/docs)
- Next.js 文档: [nextjs.org/docs](https://nextjs.org/docs)
- 项目问题: 提交 GitHub Issue