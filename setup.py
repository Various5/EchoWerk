# setup.py
#!/usr/bin/env python3
"""
Setup script for the Music App Authentication System
"""
import asyncio
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def create_env_file():
    """Create .env file from .env.example if it doesn't exist"""
    if not Path(".env").exists():
        if Path(".env.example").exists():
            print("🔄 Creating .env file from .env.example...")
            with open(".env.example", "r") as example, open(".env", "w") as env:
                content = example.read()
                # Generate a random secret key
                import secrets
                secret_key = secrets.token_urlsafe(64)
                content = content.replace(
                    "your-super-secret-key-change-this-in-production-use-long-random-string",
                    secret_key
                )
                env.write(content)
            print("✅ .env file created")
            print("⚠️  Please update the email settings in .env file")
        else:
            print("❌ .env.example file not found")
            return False
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Music App Authentication System")
    print("=" * 50)

    # Check if Docker is installed
    if not run_command("docker --version", "Checking Docker installation"):
        print("Please install Docker first: https://docs.docker.com/get-docker/")
        sys.exit(1)

    if not run_command("docker-compose --version", "Checking Docker Compose installation"):
        print("Please install Docker Compose first")
        sys.exit(1)

    # Create .env file
    if not create_env_file():
        sys.exit(1)

    # Stop any running containers
    run_command("docker-compose down", "Stopping existing containers")

    # Start the services
    if not run_command("docker-compose up -d postgres redis", "Starting database services"):
        sys.exit(1)

    # Wait for services to be ready
    print("⏳ Waiting for services to be ready...")
    import time
    time.sleep(10)

    # Install Python dependencies (for local development)
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("⚠️  Failed to install Python dependencies. You can still use Docker.")

    # Initialize Alembic (create migration directory)
    if not Path("alembic").exists():
        if not run_command("alembic init alembic", "Initializing Alembic"):
            print("⚠️  Failed to initialize Alembic")

    # Create initial migration
    if not run_command("alembic revision --autogenerate -m 'Initial migration'", "Creating initial migration"):
        print("⚠️  Failed to create initial migration")

    # Run migrations
    if not run_command("alembic upgrade head", "Running database migrations"):
        print("⚠️  Failed to run migrations")

    # Start the application
    if not run_command("docker-compose up -d app", "Starting application"):
        sys.exit(1)

    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📚 Available endpoints:")
    print("   • API Documentation: http://localhost:8000/docs")
    print("   • ReDoc Documentation: http://localhost:8000/redoc")
    print("   • Health Check: http://localhost:8000/health")
    print("   • pgAdmin: http://localhost:5050 (admin@musicapp.com / admin123)")
    print("\n🔧 Useful commands:")
    print("   • View logs: docker-compose logs -f app")
    print("   • Stop services: docker-compose down")
    print("   • Restart services: docker-compose restart")
    print("   • Run migrations: alembic upgrade head")
    print("\n⚠️  Don't forget to:")
    print("   1. Update email settings in .env file")
    print("   2. Change the secret key in production")
    print("   3. Update allowed hosts and CORS origins")

if __name__ == "__main__":
    main()