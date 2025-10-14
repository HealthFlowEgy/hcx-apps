#!/bin/bash

# ============================================================================
# HCX Beneficiary App - Integration Setup Script
# ============================================================================

echo "🚀 Setting up HCX Beneficiary App Integration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# STEP 1: Check Prerequisites
# ============================================================================

echo "📋 Step 1: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm installed: $(npm --version)${NC}"

# Check React Native CLI
if ! command -v react-native &> /dev/null; then
    echo -e "${YELLOW}⚠️  React Native CLI not found globally${NC}"
    echo "Installing via npx is recommended"
fi

echo ""

# ============================================================================
# STEP 2: Install Dependencies
# ============================================================================

echo "📦 Step 2: Installing dependencies..."

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Install additional required packages
echo "Installing additional packages..."
npm install react-native-config @react-native-async-storage/async-storage
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some packages may need manual installation${NC}"
fi

echo ""

# ============================================================================
# STEP 3: iOS Setup (if on macOS)
# ============================================================================

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Step 3: Setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo -e "${YELLOW}⚠️  CocoaPods not installed${NC}"
        echo "Installing CocoaPods..."
        sudo gem install cocoapods
    fi
    
    echo "Installing iOS pods..."
    cd ios
    pod install
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Pod install had issues, you may need to run it manually${NC}"
    else
        echo -e "${GREEN}✅ iOS pods installed${NC}"
    fi
    cd ..
else
    echo "⏭️  Step 3: Skipping iOS setup (not on macOS)"
fi

echo ""

# ============================================================================
# STEP 4: Create Directory Structure
# ============================================================================

echo "📁 Step 4: Creating directory structure..."

# Create directories if they don't exist
mkdir -p src/services
mkdir -p src/config
mkdir -p src/screens
mkdir -p src/navigation
mkdir -p src/components
mkdir -p src/utils
mkdir -p src/types

echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# ============================================================================
# STEP 5: Environment Configuration
# ============================================================================

echo "⚙️  Step 5: Setting up environment configuration..."

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env file"
    else
        rm .env
    fi
fi

# If .env doesn't exist, create it
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    
    # Ask for environment
    echo ""
    echo "Select environment:"
    echo "1) Development (default)"
    echo "2) Staging"
    echo "3) Production"
    echo "4) Local Mock"
    read -p "Enter choice (1-4): " env_choice
    
    case $env_choice in
        2)
            cp .env.staging .env 2>/dev/null || echo "# Copy from .env.staging template" > .env
            echo "Using staging environment"
            ;;
        3)
            cp .env.production .env 2>/dev/null || echo "# Copy from .env.production template" > .env
            echo "Using production environment"
            ;;
        4)
            cp .env.local .env 2>/dev/null || echo "# Copy from .env.local template" > .env
            echo "Using local mock environment"
            ;;
        *)
            cp .env.development .env 2>/dev/null || echo "# Copy from .env.development template" > .env
            echo "Using development environment"
            ;;
    esac
    
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your actual API endpoints and keys${NC}"
fi

echo ""

# ============================================================================
# STEP 6: Setup Mock Server (Optional)
# ============================================================================

echo "🔧 Step 6: Mock server setup (optional)..."
read -p "Do you want to set up a local mock server for testing? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing json-server..."
    npm install -g json-server
    
    # Create mock data
    cat > db.json << 'EOF'
{
  "profile": {
    "id": "BEN123",
    "name": "محمد أحمد",
    "nationalId": "12345678901234",
    "phone": "+20123456789",
    "email": "mohamed@example.com"
  },
  "policies": [
    {
      "id": "POL