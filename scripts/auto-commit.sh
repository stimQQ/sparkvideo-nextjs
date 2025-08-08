#!/bin/bash

# Auto-commit script for SparkVideo project
# Usage: ./scripts/auto-commit.sh "commit message"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if commit message is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a commit message${NC}"
    echo "Usage: ./scripts/auto-commit.sh \"your commit message\""
    exit 1
fi

# Get the commit message
COMMIT_MSG="$1"

# Check git status
echo -e "${YELLOW}Checking git status...${NC}"
git status --short

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}No changes to commit.${NC}"
    exit 0
fi

# Add all changes
echo -e "${YELLOW}Adding all changes...${NC}"
git add -A

# Show what will be committed
echo -e "${YELLOW}Changes to be committed:${NC}"
git status --short

# Commit with message
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "$COMMIT_MSG

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully committed and pushed to GitHub!${NC}"
    echo -e "${GREEN}Commit message: $COMMIT_MSG${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub. Please check your connection and try again.${NC}"
    exit 1
fi