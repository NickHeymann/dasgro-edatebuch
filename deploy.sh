#!/bin/bash
# Deployment-Script für Das große Datebuch
# Hetzner Server Deployment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Das große Datebuch - Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if running on Hetzner server
if [[ ! -f "/opt/apps/datebuch/docker-compose.yml" ]]; then
    echo -e "${RED}❌ Error: Not in deployment directory${NC}"
    echo -e "${YELLOW}Run this script on Hetzner server in /opt/apps/datebuch${NC}"
    exit 1
fi

cd /opt/apps/datebuch

# Step 1: Pull latest changes
echo -e "\n${YELLOW}[1/5]${NC} Pulling latest changes from Git..."
git fetch origin main
git reset --hard origin/main
echo -e "${GREEN}✓ Git pull complete${NC}"

# Step 2: Build tokens (if needed)
if [[ -f "package.json" ]]; then
    echo -e "\n${YELLOW}[2/5]${NC} Building design tokens..."
    npm run build:tokens 2>/dev/null || echo "Token build skipped"
    echo -e "${GREEN}✓ Tokens built${NC}"
else
    echo -e "\n${YELLOW}[2/5]${NC} Skipping token build (no package.json)"
fi

# Step 3: Stop old container
echo -e "\n${YELLOW}[3/5]${NC} Stopping old container..."
docker-compose down || true
echo -e "${GREEN}✓ Old container stopped${NC}"

# Step 4: Build new image
echo -e "\n${YELLOW}[4/5]${NC} Building Docker image..."
docker-compose build --no-cache
echo -e "${GREEN}✓ Docker image built${NC}"

# Step 5: Start new container
echo -e "\n${YELLOW}[5/5]${NC} Starting new container..."
docker-compose up -d
echo -e "${GREEN}✓ Container started${NC}"

# Wait for health check
echo -e "\n${YELLOW}Waiting for health check...${NC}"
sleep 5

# Check container status
if docker ps | grep -q "datebuch"; then
    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "\n${BLUE}🌐 App URL:${NC} http://91.99.177.238:3005"
    echo -e "${BLUE}📊 Logs:${NC}     docker-compose logs -f datebuch"
    echo -e "${BLUE}🩺 Health:${NC}   curl http://91.99.177.238:3005/health"
else
    echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "\n${YELLOW}Check logs:${NC} docker-compose logs datebuch"
    exit 1
fi

# Show logs (last 50 lines)
echo -e "\n${YELLOW}Recent logs:${NC}"
docker-compose logs --tail=50 datebuch
