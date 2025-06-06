#!/bin/bash

# one-click-deploy.sh
# Complete one-click deployment script for EchoWerk

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Functions
print_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
    ███████╗ ██████╗██╗  ██╗ ██████╗ ██╗    ██╗███████╗██████╗ ██╗  ██╗
    ██╔════╝██╔════╝██║  ██║██╔═══██╗██║    ██║██╔════╝██╔══██╗██║ ██╔╝
    █████╗  ██║     ███████║██║   ██║██║ █╗ ██║█████╗  ██████╔╝█████╔╝
    ██╔══╝  ██║     ██╔══██║██║   ██║██║███╗██║██╔══╝  ██╔══██╗██╔═██╗
    ███████╗╚██████╗██║  ██║╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██╗
    ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
EOF
    echo -e "${NC}"
    echo -e "${CYAN}🎵 Modern Music Authentication System - One-Click Deploy${NC}"
    echo -e "${CYAN}=================================================================${NC}"
    echo ""
}

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

print_step() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Check dependencies
check_dependencies() {
    print_step "Checking system dependencies..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        print_info "Please install Docker Desktop: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_status "Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"

    # Check Docker Compose
    if command -v "docker compose" &> /dev/null; then
        COMPOSE_CMD="docker compose"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        print_error "Docker Compose is not installed!"
        print_info "Please install Docker Compose plugin"
        exit 1
    fi
    print_status "Docker Compose: Available"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Please install Node.js 16+: https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js 16+ required. Current: $(node -v)"
        exit 1
    fi
    print_status "Node.js: $(node -v)"

    # Check Git
    if ! command -v git &> /dev/null; then
        print_warning "Git is not installed. Manual setup will be required."
    else
        print_status "Git: $(git --version | cut -d' ' -f3)"
    fi
}

# Setup project structure
setup_project() {
    print_step "Setting up project structure..."

    # Create directories
    mkdir -p echowerk/{backend,frontend}
    cd echowerk

    print_info "Project directory created: $(pwd)"
}

# Setup backend
setup_backend() {
    print_step "Setting up backend (FastAPI + PostgreSQL + Redis)..."

    cd backend

    # Create requirements.txt
    cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
asyncpg==0.29.0
redis==5.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
email-validator==2.1.0
pyotp==2.9.0
qrcode[pil]==7.4.2
python-decouple==3.8
aiosmtplib==3.0.1
pydantic[email]==2.5.0
pydantic-settings==2.1.0
argon2-cffi==23.1.0
slowapi==0.1.9
cryptography==41.0.7
EOF

    # Create basic main.py
    cat > main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="EchoWerk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "EchoWerk API is running!"}

@app.get("/")
async def root():
    return {"message": "Welcome to EchoWerk API! Visit /docs for documentation."}
EOF

    # Create Dockerfile
    cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser --disabled-password --gecos '' appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

    # Create docker-compose.yml
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: musicapp
      POSTGRES_USER: musicuser
      POSTGRES_PASSWORD: musicpass123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U musicuser -d musicapp"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass redis123
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://musicuser:musicpass123@postgres:5432/musicapp
      - REDIS_URL=redis://:redis123@redis:6379
      - SECRET_KEY=dev-secret-key-change-in-production
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

volumes:
  postgres_data:
  redis_data:
EOF

    # Create .env
    cat > .env << 'EOF'
DATABASE_URL=postgresql+asyncpg://musicuser:musicpass123@localhost:5432/musicapp
REDIS_URL=redis://:redis123@localhost:6379
SECRET_KEY=dev-secret-key-change-in-production
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
APP_NAME=EchoWerk
EOF

    print_status "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_step "Setting up frontend (React + Modern UI)..."

    cd frontend

    # Create React app
    print_info "Creating React application..."
    npx create-react-app . --silent

    # Install additional dependencies
    print_info "Installing dependencies..."
    npm install --silent react-router-dom axios react-hook-form react-hot-toast lucide-react framer-motion

    # Create basic App.js
    cat > src/App.js << 'EOF'
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🎵 <span className="gradient-text">EchoWerk</span>
          </h1>
          <p className="hero-subtitle">
            Modern Music Authentication System
          </p>
          <div className="hero-actions">
            <a href="http://localhost:8000/docs" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              View API Docs
            </a>
            <a href="http://localhost:8000/health" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              Check Backend
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
EOF

    # Create basic styles
    cat > src/App.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  color: #f8fafc;
  min-height: 100vh;
}

.App {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.gradient-text {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #00d4ff;
  color: #00d4ff;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
  }
}
EOF

    # Update package.json proxy
    npm pkg set proxy=http://localhost:8000

    # Create .env
    cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APP_NAME=EchoWerk
GENERATE_SOURCEMAP=false
EOF

    print_status "Frontend setup completed"
    cd ..
}

# Start services
start_services() {
    print_step "Starting all services..."

    # Start backend
    print_info "Starting backend services..."
    cd backend
    $COMPOSE_CMD up -d --build
    cd ..

    # Wait for backend to be ready
    print_info "Waiting for backend to be ready..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done

    if [ $timeout -le 0 ]; then
        print_warning "Backend health check timeout, but continuing..."
    else
        print_status "Backend is ready!"
    fi

    # Start frontend
    print_info "Starting frontend..."
    cd frontend

    # Install dependencies and start in background
    npm install --silent
    npm start &
    FRONTEND_PID=$!

    print_info "Frontend starting in background (PID: $FRONTEND_PID)..."
    cd ..
}

# Show results
show_results() {
    print_step "Deployment completed!"

    echo ""
    echo -e "${CYAN}🎯 Access Points:${NC}"
    echo -e "${GREEN}   Frontend:     http://localhost:3000${NC}"
    echo -e "${GREEN}   Backend API:  http://localhost:8000${NC}"
    echo -e "${GREEN}   API Docs:     http://localhost:8000/docs${NC}"
    echo -e "${GREEN}   Health Check: http://localhost:8000/health${NC}"

    echo ""
    echo -e "${CYAN}🔧 Management Commands:${NC}"
    echo -e "${BLUE}   Backend logs:   cd backend && $COMPOSE_CMD logs -f${NC}"
    echo -e "${BLUE}   Stop backend:   cd backend && $COMPOSE_CMD down${NC}"
    echo -e "${BLUE}   Restart:        cd backend && $COMPOSE_CMD restart${NC}"

    echo ""
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo -e "${YELLOW}   1. Copy the complete authentication code from the artifacts${NC}"
    echo -e "${YELLOW}   2. Update backend/.env with your email settings${NC}"
    echo -e "${YELLOW}   3. Replace frontend/src/App.js with the full React app${NC}"
    echo -e "${YELLOW}   4. Add all the React components and pages${NC}"

    echo ""
    echo -e "${PURPLE}🎵 EchoWerk is now running! 🚀${NC}"

    # Wait a bit then open browser
    sleep 3
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    fi
}

# Cleanup function
cleanup() {
    print_info "Cleaning up..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

# Trap cleanup
trap cleanup EXIT

# Main execution
main() {
    print_banner

    # Check if already in echowerk directory
    if [[ $(basename $(pwd)) == "echowerk" ]]; then
        print_warning "Already in echowerk directory. Continuing..."
    else
        setup_project
    fi

    check_dependencies
    setup_backend
    setup_frontend
    start_services
    show_results

    # Keep script running
    print_info "Press Ctrl+C to stop all services and exit"
    wait
}

# Run main function
main "$@"