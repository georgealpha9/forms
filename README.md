# Forms POC - Form Builder & Renderer System

A comprehensive form builder and renderer system with Django backend integration, built as a monorepo with native drag-and-drop, multi-step wizards, and conditional logic using JSONLogic.

## 🎯 Overview

This project provides a complete solution for building, rendering, and managing dynamic forms:

- **Visual Form Builder**: Drag-and-drop interface for creating forms
- **Form Renderer**: Accessible, multi-step form renderer
- **Backend Integration**: Django package for validation and storage
- **Conditional Logic**: JSONLogic support for dynamic field visibility
- **Type-Safe**: Fully typed with TypeScript
- **Accessible**: Built with accessibility best practices

## 🏗️ Architecture

```
forms-poc/
├── packages/
│   ├── shared/          # Shared TypeScript types and utilities
│   ├── renderer/        # Form renderer (Lit Elements)
│   ├── builder/         # Form builder with drag-and-drop (Lit Elements)
│   └── backend/         # Django form validation module
└── Documentation files
```

## ✨ Features

### Form Builder
- ✅ Drag-and-drop field placement (native HTML5)
- ✅ Real-time property editing
- ✅ Multi-step form creation
- ✅ Export form definitions as JSON
- ✅ Visual field configuration
- ✅ Field validation rules
- ✅ Conditional logic support

### Form Renderer
- ✅ Multi-step wizard support
- ✅ Progress indicators
- ✅ Real-time validation
- ✅ Conditional field visibility
- ✅ Cross-step logic
- ✅ Accessible form controls
- ✅ Responsive design
- ✅ Custom styling support

### Backend (Django)
- ✅ Form definition storage
- ✅ Submission handling
- ✅ Server-side validation
- ✅ JSONLogic evaluation
- ✅ Django admin integration
- ✅ REST API endpoints
- ✅ Validation rules management

### Field Types (Initial)
- ✅ Text input
- ✅ Email input
- ✅ Number input
- ✅ Textarea

### Validation
- ✅ Required fields
- ✅ Email validation
- ✅ Min/max length
- ✅ Min/max value
- ✅ Pattern matching (regex)
- ✅ Custom validation rules

### Conditional Logic
- ✅ Field-level conditions
- ✅ Step-level conditions
- ✅ JSONLogic integration
- ✅ Cross-field dependencies
- ⏳ Visual logic builder (planned)

## 🚀 Tech Stack

- **Frontend Framework**: [Lit Elements](https://lit.dev/) (Web Components)
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Conditional Logic**: [JSONLogic](http://jsonlogic.com/)
- **Type System**: TypeScript
- **Backend**: Django 4+
- **Build Tool**: Vite
- **Package Manager**: npm workspaces

## 📦 Packages

### @forms-poc/shared
Shared TypeScript types, validation utilities, and JSONLogic helpers.

**Key exports:**
- Form definition types
- Field types
- Validation utilities
- Logic evaluation functions

### @forms-poc/renderer
Form renderer component built with Lit Elements.

**Key features:**
- Multi-step form rendering
- Real-time validation
- Conditional field visibility
- Accessibility support
- Event-based submission handling

### @forms-poc/builder
Visual form builder with drag-and-drop interface.

**Key features:**
- Drag-and-drop field placement
- Property editor panel
- Multi-step configuration
- JSON export
- Live preview

### @forms-poc/backend
Django package for backend integration.

**Key features:**
- Form definition models
- Submission storage
- Server-side validation
- Django admin integration
- REST API endpoints

## 🎬 Getting Started

### Quick Start

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Start the builder:**
   ```bash
   npm run dev:builder
   ```
   Open http://localhost:5173

3. **Start the renderer:**
   ```bash
   npm run dev:renderer
   ```
   Open http://localhost:5173

### Django Setup

1. **Install the backend package:**
   ```bash
   cd packages/backend
   pip install -e .
   ```

2. **Configure Django:**
   ```python
   INSTALLED_APPS = [
       # ...
       'forms_builder',
   ]
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate forms_builder
   ```

📖 See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions.

## 🎮 Try the Example Project

Want to see everything in action? Check out the complete Django example:

```bash
cd example-django
pip install -r requirements.txt
./setup.sh  # or setup.bat on Windows
python manage.py runserver
```

Then visit http://127.0.0.1:8000 to explore:
- 🏠 Interactive demo homepage
- 🎨 Form builder interface
- 📋 Three pre-loaded example forms
- 🔧 Django admin integration
- 📊 Submission tracking

👉 [Read the Example Project Guide](./example-django/README.md)

## 📚 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview and achievements
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete file structure and navigation guide
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup and usage guide
- **[example-django/README.md](./example-django/README.md)** - Django example project with full demo
- **[example-django/QUICKSTART.md](./example-django/QUICKSTART.md)** - 5-minute quick start guide
- **[NL_DESIGN_SYSTEM.md](./NL_DESIGN_SYSTEM.md)** - NL Design System integration guide
- **[JSONLOGIC_BUILDER.md](./JSONLOGIC_BUILDER.md)** - Visual logic builder concept and roadmap
- **[packages/backend/README.md](./packages/backend/README.md)** - Django package documentation

## 🎨 Example: Creating a Form

### Using the Builder

1. Start the builder development server
2. Drag fields from the palette
3. Configure field properties
4. Export the JSON definition

### Programmatically

```javascript
const formDefinition = {
  id: 'contact-form',
  title: 'Contact Form',
  isMultiStep: false,
  steps: [{
    id: 'step-1',
    title: 'Contact Information',
    order: 0,
    fields: [{
      id: 'name',
      type: 'text',
      name: 'name',
      label: 'Full Name',
      required: true,
      validation: [{
        type: 'required',
        message: 'Name is required'
      }]
    }]
  }]
};
```

### Rendering

```html
<form-renderer id="my-form"></form-renderer>

<script type="module">
  const form = document.getElementById('my-form');
  form.definition = formDefinition;

  form.addEventListener('form-submit', (event) => {
    console.log('Form data:', event.detail.data);
  });
</script>
```

## 🔄 Build and Deploy

```bash
# Build all packages
npm run build:all

# Build individual packages
npm run build -w @forms-poc/shared
npm run build -w @forms-poc/renderer
npm run build -w @forms-poc/builder
```

## 🛣️ Roadmap

### Completed ✅
- [x] Monorepo setup with npm workspaces
- [x] Shared types and utilities
- [x] Form renderer with Lit Elements
- [x] Form builder with drag-and-drop
- [x] Multi-step wizard support
- [x] JSONLogic conditional logic
- [x] Cross-step logic capability
- [x] Django backend package
- [x] Django admin integration
- [x] Basic field types (text, email, number, textarea)

### In Progress 🚧
- [ ] NL Design System integration
- [ ] Visual JSONLogic builder

### Planned 📋
- [ ] Additional field types (select, radio, checkbox, date, file)
- [ ] Custom field type support
- [ ] Form templates
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Internationalization (i18n)
- [ ] Form versioning
- [ ] Webhook support
- [ ] Email notifications
- [ ] PDF export
- [ ] CSV export of submissions

## 🤝 Contributing

This is a proof of concept. Contributions, ideas, and feedback are welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

- [Lit](https://lit.dev/) - Fast, lightweight web components
- [JSONLogic](http://jsonlogic.com/) - Conditional logic engine
- [NL Design System](https://nldesignsystem.nl/) - Dutch government design system
- [Django](https://www.djangoproject.com/) - Python web framework
