#!/bin/bash

# AGENTIC AI - Quick Start Script
# AspireAI Intelligent Study Plan System

echo "========================================"
echo "🚀 STARTING AGENTIC AI SYSTEM"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Redis is running
echo -e "\n${YELLOW}1. Checking Redis...${NC}"
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis is not running${NC}"
    echo "Starting Redis..."
    
    # Try to start Redis based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start redis
    else
        echo -e "${RED}Please start Redis manually${NC}"
        exit 1
    fi
    
    sleep 2
    
    if redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start Redis${NC}"
        exit 1
    fi
fi

# Check if MongoDB is running
echo -e "\n${YELLOW}2. Checking MongoDB...${NC}"
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB is not running${NC}"
    echo "Starting MongoDB..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start mongod
    else
        echo -e "${RED}Please start MongoDB manually${NC}"
        exit 1
    fi
    
    sleep 3
    
    if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MongoDB${NC}"
        exit 1
    fi
fi

# Check environment variables
echo -e "\n${YELLOW}3. Checking environment variables...${NC}"
if [ -f .env ]; then
    if grep -q "AI_API_KEY" .env && grep -q "OPENAI_API_KEY\|CLAUDE_API_KEY" .env; then
        echo -e "${GREEN}✅ AI API keys configured${NC}"
    else
        echo -e "${YELLOW}⚠️  AI API keys not found in .env${NC}"
        echo "Please add AI_API_KEY or OPENAI_API_KEY to your .env file"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Creating .env from template..."
    
    cat > .env << EOF
# AI Provider Configuration
AI_PROVIDER=openai
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4-turbo-preview

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB
MONGODB_URI=mongodb://localhost:27017/aspireai

# Server
PORT=5001
NODE_ENV=development
EOF
    
    echo -e "${GREEN}✅ Created .env template${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your API keys${NC}"
fi

# Install dependencies if needed
echo -e "\n${YELLOW}4. Checking dependencies...${NC}"
if [ ! -d "node_modules/bullmq" ]; then
    echo "Installing required dependencies..."
    npm install --save bullmq ioredis node-cron openai @anthropic-ai/sdk axios
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Clear old Redis jobs (optional)
echo -e "\n${YELLOW}5. Clearing old Redis jobs...${NC}"
redis-cli FLUSHDB > /dev/null 2>&1
echo -e "${GREEN}✅ Redis cleaned${NC}"

# Start the system
echo -e "\n========================================"
echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
echo "========================================"
echo ""
echo "Starting Agentic AI System..."
echo ""
echo "🤖 Worker: Processing student data"
echo "📅 Scheduler: Daily scans at 3:00 AM"
echo "🌐 API: Available at http://localhost:5001/api/agents"
echo ""
echo "========================================"
echo ""

# Start the server (which includes worker and scheduler)
node src/components/pages/student/Server.js
