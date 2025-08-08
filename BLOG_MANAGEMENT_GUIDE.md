# 博客管理系统文档

## 📋 概述

SparkVideo博客管理系统提供完整的内容管理功能，包括文章的创建、编辑、发布和SEO优化。系统分为前台展示和后台管理两部分。

## 🏗️ 系统架构

### 路径结构

```
前台（公开访问）:
/blog                     # 博客列表页
/blog/[slug]             # 文章详情页

后台（需要管理员权限）:
/admin/blog              # 博客管理列表
/admin/blog/new          # 新建文章
/admin/blog/[id]/edit    # 编辑文章
/admin/blog/categories   # 分类管理
/admin/blog/tags         # 标签管理
```

### 权限控制

- **前台页面**: 所有用户可访问
- **后台页面**: 仅限管理员（role: ADMIN）访问
- 自动权限检查：未登录跳转到登录页，非管理员跳转到用户仪表板

## 📁 文件结构

```
app/
├── [locale]/
│   ├── blog/                      # 前台博客页面
│   │   └── page.tsx               # 博客列表
│   └── admin/                     # 后台管理
│       ├── layout.tsx             # 管理后台布局
│       └── blog/                  # 博客管理
│           ├── page.tsx           # 文章列表
│           ├── new/page.tsx       # 新建文章
│           └── [id]/edit/page.tsx # 编辑文章
├── components/
│   └── admin/                     # 管理后台组件
│       ├── sidebar.tsx            # 侧边栏导航
│       ├── header.tsx             # 顶部导航
│       └── blog-editor.tsx        # 博客编辑器
└── services/
    └── blog.service.ts            # 博客API服务
```

## 🔧 功能特性

### 1. 文章管理

#### 创建文章
- 支持Markdown格式
- 自动生成URL slug
- 自动提取摘要
- 特色图片设置
- 多语言支持（中文/英文）

#### 编辑功能
- 实时预览
- 草稿保存
- 版本历史（后续实现）
- 自动保存（后续实现）

#### 发布控制
- 三种状态：草稿、已发布、已归档
- 定时发布（后续实现）
- 批量操作

### 2. 分类和标签

#### 分类管理
- 层级分类支持
- 分类描述
- SEO友好的slug

#### 标签系统
- 动态标签添加
- 标签使用统计
- 标签云展示

### 3. SEO优化

#### Meta信息
- 自定义Meta标题
- Meta描述
- 关键词设置
- Open Graph标签

#### URL优化
- 自定义URL slug
- 自动生成SEO友好的URL
- 301重定向管理（后续实现）

### 4. 多语言支持

- 中文/英文内容管理
- 语言切换
- 独立的语言版本

## 💻 使用指南

### 管理员登录

1. 访问 `/login` 页面
2. 使用管理员账号登录
3. 系统自动识别管理员身份

### 创建新文章

1. 进入管理后台 `/admin/blog`
2. 点击"新建文章"按钮
3. 填写文章信息：
   - **标题**: 文章标题（必填）
   - **内容**: Markdown格式的文章内容（必填）
   - **分类**: 选择文章分类
   - **标签**: 添加相关标签
   - **摘要**: 文章简介（可自动生成）
   - **SEO设置**: Meta信息配置

4. 选择发布状态：
   - **草稿**: 保存但不公开
   - **发布**: 立即公开显示
   - **归档**: 隐藏文章

5. 点击"保存文章"

### 编辑文章

1. 在文章列表找到要编辑的文章
2. 点击"编辑"按钮
3. 修改文章内容
4. 保存更改

### 管理分类和标签

1. 进入分类管理页面 `/admin/blog/categories`
2. 添加、编辑或删除分类
3. 进入标签管理页面 `/admin/blog/tags`
4. 查看和管理所有标签

## 🔌 API接口

### 公开接口（前台）

```javascript
GET /api/v1/blog                 // 获取文章列表
GET /api/v1/blog/slug/{slug}     // 获取文章详情
GET /api/v1/blog/search          // 搜索文章
GET /api/v1/blog/popular         // 热门文章
GET /api/v1/blog/related/{id}    // 相关文章
```

### 管理接口（后台）

```javascript
GET    /api/admin/blog/posts          // 获取所有文章
GET    /api/admin/blog/posts/{id}     // 获取文章详情
POST   /api/admin/blog/posts          // 创建文章
PUT    /api/admin/blog/posts/{id}     // 更新文章
DELETE /api/admin/blog/posts/{id}     // 删除文章
POST   /api/admin/blog/posts/{id}/publish   // 发布文章
POST   /api/admin/blog/posts/{id}/unpublish // 取消发布

// 分类管理
GET    /api/admin/blog/categories     // 获取分类列表
POST   /api/admin/blog/categories     // 创建分类
PUT    /api/admin/blog/categories/{id}// 更新分类
DELETE /api/admin/blog/categories/{id}// 删除分类

// 标签管理
GET    /api/admin/blog/tags          // 获取标签列表
POST   /api/admin/blog/tags          // 创建标签
DELETE /api/admin/blog/tags/{id}     // 删除标签

// 统计数据
GET    /api/admin/blog/stats         // 获取统计信息
```

## 🎨 Markdown支持

支持的Markdown语法：

- 标题 (# ## ###)
- 粗体 (**text**)
- 斜体 (*text*)
- 链接 [text](url)
- 图片 ![alt](url)
- 列表（有序/无序）
- 代码块 ```language
- 表格
- 引用 >
- 分割线 ---

## 🔐 安全性

### 权限验证
- JWT token验证
- 角色权限检查（ADMIN）
- API访问控制

### 内容安全
- XSS防护
- SQL注入防护
- 文件上传验证
- 内容过滤

## 📊 数据模型

### BlogPost

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes?: number;
  language: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}
```

## 🚀 部署配置

### 环境变量

```env
# API配置
NEXT_PUBLIC_API_BASE_URL=https://api.sparkvideo.cc/api

# 图片上传（可选）
NEXT_PUBLIC_UPLOAD_URL=https://upload.sparkvideo.cc
NEXT_PUBLIC_CDN_URL=https://cdn.sparkvideo.cc
```

### Vercel部署

1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 部署

## 📈 统计和分析

### 文章统计
- 总文章数
- 总浏览量
- 分类分布
- 标签使用率

### 用户行为
- 热门文章
- 阅读时长
- 分享统计
- 评论互动

## 🔄 后续优化

### 计划功能
- [ ] 富文本编辑器（TinyMCE/CKEditor）
- [ ] 图片上传和管理
- [ ] 文章版本控制
- [ ] 自动保存草稿
- [ ] 评论系统
- [ ] 文章定时发布
- [ ] RSS订阅
- [ ] 文章导入/导出
- [ ] AI写作助手
- [ ] 文章推荐算法

### 性能优化
- [ ] 静态生成(SSG)
- [ ] 增量静态再生(ISR)
- [ ] 图片懒加载
- [ ] 内容CDN加速

## 🆘 常见问题

### Q: 如何修改管理员权限？
A: 在数据库中将用户的role字段设置为'ADMIN'

### Q: 文章不显示在前台？
A: 检查文章状态是否为'published'

### Q: 如何备份博客数据？
A: 通过API导出所有文章数据，或直接备份数据库

### Q: 支持哪些图片格式？
A: 支持JPG、PNG、GIF、WebP格式

## 📞 技术支持

- GitHub Issues: [提交问题](https://github.com/sparkvideo/issues)
- 文档: [在线文档](https://docs.sparkvideo.cc)
- 邮件: support@sparkvideo.cc