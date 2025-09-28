#!/bin/bash

# Pixora Project Setup Script
# This script automatically fixes permissions and prepares the project for development

set -e  # Exit on any error

echo "🚀 Starting Pixora project setup..."

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Project root: $PROJECT_ROOT"

# Get the current user
CURRENT_USER=$(whoami)
echo "👤 Current user: $CURRENT_USER"

# Function to check if running as root
check_sudo() {
    if [ "$EUID" -eq 0 ]; then
        echo "❌ Please don't run this script as root. Run as your regular user."
        exit 1
    fi
}

# Function to fix permissions
fix_permissions() {
    echo "🔧 Fixing project permissions..."
    
    # Fix ownership of the entire project
    echo "📝 Changing ownership to $CURRENT_USER..."
    sudo chown -R "$CURRENT_USER:staff" "$PROJECT_ROOT"
    
    # Ensure data directories exist and have correct permissions
    echo "📁 Ensuring data directories exist..."
    mkdir -p "$PROJECT_ROOT/frontend/data"
    mkdir -p "$PROJECT_ROOT/video-directory"
    
    # Set proper permissions for data directories
    chmod 755 "$PROJECT_ROOT/frontend/data"
    chmod 755 "$PROJECT_ROOT/video-directory"
    
    # Ensure data files exist with proper permissions
    touch "$PROJECT_ROOT/frontend/data/chatSessions.json"
    touch "$PROJECT_ROOT/frontend/data/users.json"
    chmod 644 "$PROJECT_ROOT/frontend/data/chatSessions.json"
    chmod 644 "$PROJECT_ROOT/frontend/data/users.json"
    
    echo "✅ Permissions fixed successfully!"
}

# Function to install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Install frontend dependencies
    if [ -d "$PROJECT_ROOT/frontend" ]; then
        echo "📦 Installing frontend dependencies..."
        cd "$PROJECT_ROOT/frontend"
        npm install
        cd "$PROJECT_ROOT"
    fi
    
    # Install template dependencies if exists
    if [ -d "$PROJECT_ROOT/init-template" ]; then
        echo "📦 Installing template dependencies..."
        cd "$PROJECT_ROOT/init-template"
        npm install
        cd "$PROJECT_ROOT"
    fi
    
    echo "✅ Dependencies installed successfully!"
}

# Function to verify setup
verify_setup() {
    echo "🔍 Verifying setup..."
    
    # Check if data files are writable
    if [ -w "$PROJECT_ROOT/frontend/data/chatSessions.json" ]; then
        echo "✅ Chat sessions file is writable"
    else
        echo "❌ Chat sessions file is not writable"
        return 1
    fi
    
    # Check if video directory is writable
    if [ -w "$PROJECT_ROOT/video-directory" ]; then
        echo "✅ Video directory is writable"
    else
        echo "❌ Video directory is not writable"
        return 1
    fi
    
    # Check if node_modules exists
    if [ -d "$PROJECT_ROOT/frontend/node_modules" ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "❌ Frontend dependencies not found"
        return 1
    fi
    
    echo "✅ Setup verification completed successfully!"
}

# Main execution
main() {
    echo "🎬 Pixora Project Setup"
    echo "====================="
    
    check_sudo
    fix_permissions
    install_dependencies
    verify_setup
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' in the frontend directory to start the development server"
    echo "2. Open http://localhost:3000 in your browser"
    echo "3. Start creating your video projects!"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
