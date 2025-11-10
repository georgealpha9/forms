@echo off
REM Setup script for Django example project (Windows)

echo Setting up Forms Builder Django Example...
echo.

REM Check if manage.py exists
if not exist "manage.py" (
    echo Error: Please run this script from the example-django directory
    exit /b 1
)

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies
    exit /b 1
)

REM Install forms_builder package
echo Installing forms_builder package...
cd ..\packages\backend
pip install -e .
if errorlevel 1 (
    echo Error installing forms_builder
    exit /b 1
)
cd ..\..\example-django

REM Run migrations
echo Running database migrations...
python manage.py migrate
if errorlevel 1 (
    echo Error running migrations
    exit /b 1
)

REM Create superuser
echo.
echo Creating superuser...
echo (You can skip this if you already have one)
python manage.py createsuperuser

REM Load example forms
echo.
echo Loading example forms...
python manage.py loaddata demo_project\fixtures\example_forms.json

echo.
echo Setup complete!
echo.
echo Next steps:
echo   1. Start the server: python manage.py runserver
echo   2. Visit http://127.0.0.1:8000
echo.
pause
