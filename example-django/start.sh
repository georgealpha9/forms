#!/bin/bash
# Quick start script for Django example project

set -e

echo "🚀 Starting Forms Builder Demo..."
echo ""

# Check if database exists
if [ ! -f "db.sqlite3" ]; then
    echo "📋 Database not found. Running initial setup..."
    ./setup.sh
fi

# Start the development server
echo "🌐 Starting development server..."
echo "   Visit: http://127.0.0.1:8000"
echo "   Admin: http://127.0.0.1:8000/admin"
echo "   Press Ctrl+C to stop"
echo ""

python manage.py runserver
