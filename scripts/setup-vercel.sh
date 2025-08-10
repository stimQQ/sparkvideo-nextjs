#!/bin/bash

echo "🚀 SparkVideo Vercel 部署设置向导"
echo "================================"
echo ""
echo "此脚本将帮助你配置 Vercel 自动部署所需的环境变量和密钥"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI 未安装，正在安装...${NC}"
    npm i -g vercel
fi

# 登录 Vercel
echo -e "${GREEN}步骤 1: 登录 Vercel${NC}"
vercel login

# 链接项目
echo -e "${GREEN}步骤 2: 链接 Vercel 项目${NC}"
vercel link

# 获取项目信息
echo -e "${GREEN}步骤 3: 获取项目配置信息${NC}"
echo "请访问以下链接获取你的配置信息："
echo "https://vercel.com/account/tokens"
echo ""

read -p "请输入你的 Vercel Token: " VERCEL_TOKEN
read -p "请输入你的 Organization ID: " VERCEL_ORG_ID
read -p "请输入你的 Project ID: " VERCEL_PROJECT_ID

# 设置 GitHub Secrets
echo -e "${GREEN}步骤 4: 配置 GitHub Secrets${NC}"
echo ""
echo "请在你的 GitHub 仓库中添加以下 Secrets："
echo "(Settings -> Secrets and variables -> Actions)"
echo ""
echo -e "${YELLOW}VERCEL_TOKEN=${NC}$VERCEL_TOKEN"
echo -e "${YELLOW}VERCEL_ORG_ID=${NC}$VERCEL_ORG_ID"
echo -e "${YELLOW}VERCEL_PROJECT_ID=${NC}$VERCEL_PROJECT_ID"
echo ""

# 设置环境变量
echo -e "${GREEN}步骤 5: 配置 Vercel 环境变量${NC}"
echo "正在为不同环境设置变量..."

# 生产环境变量
vercel env add NEXT_PUBLIC_API_URL production
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add REDIS_URL production

# 预览环境变量
vercel env add NEXT_PUBLIC_API_URL preview
vercel env add DATABASE_URL preview
vercel env add JWT_SECRET preview
vercel env add REDIS_URL preview

# 开发环境变量
vercel env add NEXT_PUBLIC_API_URL development
vercel env add DATABASE_URL development
vercel env add JWT_SECRET development
vercel env add REDIS_URL development

echo ""
echo -e "${GREEN}✅ Vercel 部署配置完成！${NC}"
echo ""
echo "后续步骤："
echo "1. 提交代码到 GitHub"
echo "2. 推送到 main 分支将自动部署到生产环境"
echo "3. 推送到 develop 分支将自动部署到预览环境"
echo "4. Pull Request 将自动创建预览部署"
echo ""
echo "部署命令："
echo "  手动部署到生产: vercel --prod"
echo "  手动部署到预览: vercel"
echo ""