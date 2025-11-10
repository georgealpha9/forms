#!/bin/bash
# Setup script for Django example project

set -e  # Exit on error

echo "🚀 Setting up Forms Builder Django Example..."
echo ""

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: Please run this script from the example-django directory"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install forms_builder package
echo "📦 Installing forms_builder package..."
cd ../packages/backend
pip install -e .
cd ../../example-django

# Run migrations
echo "🔧 Running database migrations..."
python manage.py migrate

# Check if superuser exists
echo ""
echo "👤 Creating superuser..."
echo "   (Skip if you already have one)"
python manage.py createsuperuser --noinput --username admin --email admin@example.com 2>/dev/null || true

# Load example forms
echo ""
echo "📋 Loading example forms..."
python manage.py loaddata demo_project/fixtures/example_forms.json

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Next steps:"
echo "   1. If you skipped superuser creation, run: python manage.py createsuperuser"
echo "   2. Start the server: python manage.py runserver"
echo "   3. Visit http://127.0.0.1:8000"
echo ""
echo "📚 Default credentials (if created):"
echo "   Username: admin"
echo "   Password: admin"
echo "   (Change these in production!)"
echo ""
