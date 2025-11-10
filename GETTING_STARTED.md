# Getting Started with Forms POC

This guide will help you set up and run the Forms Builder and Renderer system.

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- npm (comes with Node.js)
- Django 4.0+ (for backend)

## Installation

### 1. Install Dependencies

From the root directory:

```bash
# Install all npm dependencies
npm install
```

This will install dependencies for all packages in the monorepo.

### 2. Install Backend (Django)

```bash
cd packages/backend
pip install -e .
# or
pip install -r requirements.txt
```

## Running the Development Servers

### Form Builder

```bash
npm run dev:builder
```

Then open http://localhost:5173 in your browser.

### Form Renderer

```bash
npm run dev:renderer
```

Then open http://localhost:5173 in your browser.

## Building for Production

### Build All Packages

```bash
npm run build:all
```

### Build Individual Packages

```bash
# Build shared types
cd packages/shared
npm run build

# Build renderer
cd packages/renderer
npm run build

# Build builder
cd packages/builder
npm run build
```

## Using with Django

### 1. Configure Django Settings

Add to your `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    'forms_builder',
]
```

### 2. Configure URLs

Add to your `urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    # ...
    path('forms/', include('forms_builder.urls')),
]
```

### 3. Run Migrations

```bash
python manage.py migrate forms_builder
```

### 4. Create Superuser (if needed)

```bash
python manage.py createsuperuser
```

### 5. Run Django Server

```bash
python manage.py runserver
```

### 6. Access Django Admin

Navigate to http://localhost:8000/admin/ and log in with your superuser credentials.

## Creating Your First Form

### Option 1: Using the Form Builder

1. Start the form builder development server:
   ```bash
   npm run dev:builder
   ```

2. Open http://localhost:5173

3. Design your form by dragging fields from the palette

4. Configure field properties in the right panel

5. Export the form definition JSON

6. Import the JSON into Django admin

### Option 2: In Django Admin

1. Navigate to Forms Builder → Form Definitions

2. Click "Add Form Definition"

3. Use the visual form builder interface

4. Configure form settings

5. Save the form

## Rendering a Form

### Option 1: Using the Standalone Renderer

1. Start the renderer development server:
   ```bash
   npm run dev:renderer
   ```

2. Open http://localhost:5173

3. Modify `index.html` to load your form definition

### Option 2: Integrate with Your Website

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="path/to/@forms-poc/renderer/dist/index.js"></script>
</head>
<body>
  <form-renderer id="my-form"></form-renderer>

  <script type="module">
    // Fetch form definition from Django
    const response = await fetch('/forms/api/forms/contact-form/');
    const { form } = await response.json();

    // Set form definition
    const formElement = document.getElementById('my-form');
    formElement.definition = form;

    // Handle submission
    formElement.addEventListener('form-submit', async (event) => {
      const response = await fetch('/forms/api/forms/contact-form/submit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event.detail.data)
      });

      if (response.ok) {
        alert('Form submitted successfully!');
      }
    });
  </script>
</body>
</html>
```

## Project Structure

```
forms-poc/
├── packages/
│   ├── shared/          # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── validation.ts
│   │   │   └── logic.ts
│   │   └── package.json
│   │
│   ├── renderer/        # Form renderer (Lit Elements)
│   │   ├── src/
│   │   │   └── components/
│   │   ├── index.html
│   │   └── package.json
│   │
│   ├── builder/         # Form builder (Lit Elements)
│   │   ├── src/
│   │   │   └── components/
│   │   ├── index.html
│   │   └── package.json
│   │
│   └── backend/         # Django package
│       ├── forms_builder/
│       │   ├── models.py
│       │   ├── admin.py
│       │   ├── views.py
│       │   └── validation.py
│       └── setup.py
│
├── package.json         # Root package.json (workspaces)
└── README.md
```

## Key Features

### Multi-Step Forms

Forms can have multiple steps with navigation:

```javascript
{
  isMultiStep: true,
  steps: [
    {
      id: 'step-1',
      title: 'Personal Info',
      fields: [...]
    },
    {
      id: 'step-2',
      title: 'Additional Details',
      fields: [...]
    }
  ]
}
```

### Conditional Logic

Fields and steps can have conditional logic using JSONLogic:

```javascript
{
  id: 'email-field',
  type: 'email',
  conditionalLogic: {
    '==': [{ var: 'contact_method' }, 'email']
  }
}
```

This field will only show if `contact_method` equals 'email'.

### Validation

Fields support multiple validation rules:

```javascript
{
  id: 'age',
  type: 'number',
  validation: [
    {
      type: 'required',
      message: 'Age is required'
    },
    {
      type: 'min',
      value: 18,
      message: 'Must be 18 or older'
    }
  ]
}
```

## Troubleshooting

### Module Not Found Errors

Make sure you've installed all dependencies:

```bash
npm install
```

### TypeScript Errors

Build the shared package first:

```bash
cd packages/shared
npm run build
```

### Django Migration Errors

Make sure you've added the app to INSTALLED_APPS and run migrations:

```bash
python manage.py migrate forms_builder
```

## Next Steps

- Explore the example forms in the demo pages
- Read the API documentation in each package's README
- Customize the styling to match your brand
- Add custom field types
- Implement NL Design System components for accessibility
- Create a visual JSONLogic builder UI

## Support

For issues and questions, please refer to the README files in each package directory.
