#!/bin/bash

# setup-frontend.sh
# Complete setup script for EchoWerk Frontend

set -e

echo "🎵 Setting up EchoWerk Frontend..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    print_info "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Create frontend directory if it doesn't exist
if [ ! -d "frontend" ]; then
    print_info "Creating frontend directory..."
    mkdir frontend
fi

cd frontend

# Initialize React app if package.json doesn't exist
if [ ! -f "package.json" ]; then
    print_info "Initializing React application..."
    npx create-react-app . --template typescript

    # Remove TypeScript files and dependencies for JavaScript setup
    print_info "Converting to JavaScript setup..."
    rm -f src/*.ts src/*.tsx
    npm uninstall typescript @types/node @types/react @types/react-dom @types/jest
fi

# Install required dependencies
print_info "Installing dependencies..."
npm install react-router-dom axios react-hook-form react-hot-toast lucide-react framer-motion

# Install development dependencies
npm install --save-dev prettier eslint-config-prettier

# Create directory structure
print_info "Creating directory structure..."
mkdir -p src/components
mkdir -p src/contexts
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p public

# Create package.json with correct configuration
cat > package.json << 'EOF'
{
  "name": "echowerk-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:8000"
}
EOF

# Create environment file
print_info "Creating environment configuration..."
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APP_NAME=EchoWerk
GENERATE_SOURCEMAP=false
EOF

# Create prettier configuration
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Coverage
coverage/

# ESLint cache
.eslintcache
EOF

# Create public/index.html
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0f0f23" />
    <meta name="description" content="EchoWerk - Modern Music Authentication System" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>EchoWerk - Music Authentication</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create manifest.json
cat > public/manifest.json << 'EOF'
{
  "short_name": "EchoWerk",
  "name": "EchoWerk Music Authentication",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0f0f23",
  "background_color": "#0f0f23"
}
EOF

# Install dependencies
print_info "Installing npm dependencies..."
npm install

print_status "Frontend setup completed successfully!"
print_info "Next steps:"
echo "  1. Copy the provided React components to their respective files"
echo "  2. Copy the CSS styles to src/App.css"
echo "  3. Make sure your backend is running on http://localhost:8000"
echo "  4. Run 'npm start' to start the development server"
echo ""
print_warning "Don't forget to copy all the component files from the artifacts!"

# Create a helper script to copy components
cat > copy-components.sh << 'EOF'
#!/bin/bash

echo "📁 Creating component files..."

# This script creates empty files for all components
# You'll need to copy the actual code from the artifacts

touch src/App.js
touch src/index.js
touch src/App.css
touch src/components/ProtectedRoute.js
touch src/components/ErrorBoundary.js
touch src/components/LoadingSpinner.js
touch src/components/ConfirmDialog.js
touch src/components/Toast.js
touch src/contexts/AuthContext.js
touch src/pages/LandingPage.js
touch src/pages/Login.js
touch src/pages/Register.js
touch src/pages/Dashboard.js
touch src/pages/Profile.js
touch src/hooks/useLocalStorage.js
touch src/hooks/useDebounce.js
touch src/utils/validation.js
touch src/utils/formatters.js

echo "✅ Component files created!"
echo "📋 Now copy the code from the artifacts into each file"
EOF

chmod +x copy-components.sh

print_info "Created helper script: copy-components.sh"
print_info "Run './copy-components.sh' to create all component files"

echo ""
print_status "🎵 EchoWerk Frontend setup complete! 🚀"