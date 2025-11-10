# Forms Builder - Django Example Project

A complete Django demo project showcasing the Forms Builder system with frontend and backend integration.

> 🚀 **Want to get started quickly?** Check out the [QUICKSTART.md](./QUICKSTART.md) guide!

## 🎯 What's Included

This example project demonstrates:

- ✅ Django admin integration with form builder
- ✅ Form renderer displaying forms on web pages
- ✅ Visual form builder interface
- ✅ Multi-step wizard forms
- ✅ Form submission handling
- ✅ Example forms with fixtures
- ✅ Complete CRUD operations for forms
- ✅ REST API endpoints

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher (for building frontend components)
- pip (Python package manager)

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
# From the example-django directory
pip install -r requirements.txt
```

### 2. Install the Forms Builder Package

```bash
# From the project root (forms-poc/)
cd packages/backend
pip install -e .
```

### 3. Build Frontend Components (Optional for Development)

For production use, you'll want to build the frontend components:

```bash
# From the project root (forms-poc/)
npm install
npm run build:all
```

For development, you can use the components directly from source.

### 4. Run Migrations

```bash
# From the example-django directory
python manage.py migrate
```

### 5. Create a Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 6. Load Example Forms (Optional)

```bash
python manage.py loaddata demo_project/fixtures/example_forms.json
```

This will load three example forms:
- **contact-form**: Simple contact form
- **registration-form**: Multi-step registration
- **survey-form**: Customer satisfaction survey

### 7. Run the Development Server

```bash
python manage.py runserver
```

The server will start at http://127.0.0.1:8000

## 🎨 Exploring the Demo

### Home Page
Visit http://127.0.0.1:8000 to see:
- Overview of features
- Quick links to builder and admin
- Getting started guide

### Form Builder
Visit http://127.0.0.1:8000/builder/ to:
- Create forms visually with drag-and-drop
- Configure field properties
- Set up multi-step wizards
- Export form definitions as JSON

**Note:** The form builder needs the frontend components. For a full demo, build the components first or use the admin interface.

### Django Admin
Visit http://127.0.0.1:8000/admin/ to:
- Create and manage form definitions
- View form submissions
- Configure validation rules
- Import/export form JSON

### View a Form
After loading fixtures or creating a form in admin:
- Visit http://127.0.0.1:8000/renderer/contact-form/
- Or http://127.0.0.1:8000/renderer/registration-form/
- Or http://127.0.0.1:8000/renderer/survey-form/

## 📝 Creating Your First Form

### Method 1: Using the Form Builder (Recommended)

1. **Start the builder:**
   ```bash
   npm run dev:builder
   ```
   (Run this from the project root)

2. **Design your form:**
   - Open http://localhost:5173
   - Drag fields from the left palette
   - Click fields to edit properties
   - Configure validation rules
   - Set up multi-step if needed

3. **Export the definition:**
   - Click "Export Form JSON" button
   - Save the JSON file

4. **Import to Django:**
   - Go to http://127.0.0.1:8000/admin/
   - Navigate to Forms Builder → Form Definitions
   - Click "Add Form Definition"
   - Enter a unique ID (e.g., "my-form")
   - Enter title and description
   - Paste the JSON into the "Definition" field
   - Check "Is active"
   - Click "Save"

5. **View your form:**
   - Visit http://127.0.0.1:8000/renderer/my-form/

### Method 2: Using Django Admin Directly

1. **Go to admin:**
   - Visit http://127.0.0.1:8000/admin/
   - Login with your superuser credentials

2. **Create a form:**
   - Navigate to Forms Builder → Form Definitions
   - Click "Add Form Definition"

3. **Configure the form:**
   - ID: `my-custom-form` (unique identifier)
   - Title: `My Custom Form`
   - Description: Optional description
   - Multi-step: Check if you want multiple steps
   - Definition: Paste or write JSON (see example below)
   - Is active: Check to make it available

4. **Example JSON:**
   ```json
   {
     "id": "my-custom-form",
     "title": "My Custom Form",
     "description": "A simple form",
     "isMultiStep": false,
     "steps": [{
       "id": "step-1",
       "title": "Information",
       "order": 0,
       "fields": [{
         "id": "name",
         "type": "text",
         "name": "name",
         "label": "Your Name",
         "required": true,
         "validation": [{
           "type": "required",
           "message": "Name is required"
         }]
       }]
     }]
   }
   ```

5. **View your form:**
   - Visit http://127.0.0.1:8000/renderer/my-custom-form/

## 🔌 API Endpoints

### Get Form Definition
```
GET /forms/api/forms/<form_id>/
```

**Example:**
```bash
curl http://127.0.0.1:8000/forms/api/forms/contact-form/
```

### Submit Form
```
POST /forms/api/forms/<form_id>/submit/
Content-Type: application/json
```

**Example:**
```bash
curl -X POST http://127.0.0.1:8000/forms/api/forms/contact-form/submit/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Hello!"}'
```

### Validate Form
```
POST /forms/api/forms/<form_id>/validate/
Content-Type: application/json
```

**Example:**
```bash
curl -X POST http://127.0.0.1:8000/forms/api/forms/contact-form/validate/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## 📁 Project Structure

```
example-django/
├── manage.py                    # Django management script
├── requirements.txt             # Python dependencies
├── db.sqlite3                   # SQLite database (created after migrate)
├── demo_project/
│   ├── __init__.py
│   ├── settings.py             # Django settings
│   ├── urls.py                 # URL routing
│   ├── wsgi.py                 # WSGI config
│   ├── fixtures/
│   │   └── example_forms.json  # Example form fixtures
│   ├── static/
│   │   └── forms/              # Frontend component builds (optional)
│   └── templates/
│       ├── base.html           # Base template
│       ├── home.html           # Home page
│       └── forms/
│           ├── builder.html    # Form builder page
│           └── renderer.html   # Form renderer page
└── README.md                    # This file
```

## 🎯 Example Forms

### Contact Form (`contact-form`)
A simple single-step contact form with:
- Name field (required, min 2 chars)
- Email field (required, email validation)
- Message textarea (required, min 10 chars)

### Registration Form (`registration-form`)
A three-step registration wizard with:
- **Step 1:** Personal info (first name, last name, age 18+)
- **Step 2:** Contact details (email)
- **Step 3:** Additional info (optional bio)

### Survey Form (`survey-form`)
A two-step customer satisfaction survey with:
- **Step 1:** Basic information (name, purchase date)
- **Step 2:** Feedback (rating 1-5, comments)

## 🔧 Customization

### Styling

Edit the templates in `demo_project/templates/` to customize the look and feel.

### Adding Field Types

See the main project documentation for adding custom field types to the renderer.

### Custom Validation

Add custom validation rules in the Django admin or through the API.

### Email Notifications

Extend the `FormSubmissionView` in the forms_builder package to send emails on submission.

## 🐛 Troubleshooting

### "Module not found" errors
Make sure you've installed the forms_builder package:
```bash
cd packages/backend
pip install -e .
```

### Frontend components not loading
Build the frontend components:
```bash
cd ../..  # to project root
npm install
npm run build:all
```

### Forms not appearing in renderer
1. Check that the form is marked as "Is active" in admin
2. Verify the form ID in the URL matches the form ID in the database
3. Check browser console for JavaScript errors

### Database errors
Delete `db.sqlite3` and re-run migrations:
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## 📚 Additional Resources

- [Main Project README](../README.md)
- [Getting Started Guide](../GETTING_STARTED.md)
- [Backend Package Documentation](../packages/backend/README.md)
- [Django Documentation](https://docs.djangoproject.com/)

## 🎓 Learning Path

1. **Start Simple:**
   - Load the example forms
   - View them in the renderer
   - Submit some test data
   - View submissions in admin

2. **Try the Builder:**
   - Create a simple form in the builder
   - Export and import to Django
   - Test it in the renderer

3. **Explore Multi-Step:**
   - Create a multi-step form
   - Configure step navigation
   - Test the wizard flow

4. **Add Conditional Logic:**
   - Add conditional field visibility
   - Test with different user inputs
   - See fields show/hide dynamically

5. **Customize:**
   - Modify the templates
   - Add custom field types
   - Integrate with your app

## 🤝 Support

For questions or issues:
- Check the main project [README](../README.md)
- Review the [troubleshooting section](#-troubleshooting)
- Check the Django admin for validation errors

## 📄 License

This example project is part of the Forms POC and is provided as-is for demonstration purposes.
