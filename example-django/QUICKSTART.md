# ⚡ Quick Start Guide

Get the Django Forms Builder demo running in under 5 minutes!

## 🏃 One-Command Setup

### Linux/Mac:
```bash
./setup.sh
```

### Windows:
```cmd
setup.bat
```

That's it! The script will:
1. ✅ Install Python dependencies
2. ✅ Install the forms_builder package
3. ✅ Create database tables
4. ✅ Load 3 example forms
5. ✅ Prompt for admin credentials

## 🚀 Start the Server

```bash
python manage.py runserver
```

## 🎯 What to Explore

### 1. Home Page
**URL:** http://127.0.0.1:8000

Beautiful landing page with:
- Feature overview
- Quick links to builder and admin
- Getting started guide

### 2. Django Admin
**URL:** http://127.0.0.1:8000/admin

Login with the credentials you created during setup.

**Things to try:**
- View the 3 pre-loaded forms
- Create a new form
- View form submissions (after filling some forms)
- Edit form properties

### 3. Form Renderer - Try the Examples!

**Contact Form:**
http://127.0.0.1:8000/renderer/contact-form/
- Simple single-step form
- Name, email, and message fields
- Real-time validation

**Registration Form:**
http://127.0.0.1:8000/renderer/registration-form/
- Multi-step wizard (3 steps)
- Progress indicator
- Step-by-step navigation

**Survey Form:**
http://127.0.0.1:8000/renderer/survey-form/
- 2-step customer satisfaction survey
- Rating system (1-5)
- Optional feedback

### 4. Form Builder
**URL:** http://127.0.0.1:8000/builder/

Visual form builder interface.

**Note:** For full functionality, build the frontend components first:
```bash
cd .. # to forms-poc root
npm install
npm run build:builder
```

## 📝 Create Your First Form

### Method 1: JSON in Admin (Easiest)

1. Go to http://127.0.0.1:8000/admin/forms_builder/formdefinition/add/

2. Enter:
   - **ID:** `my-first-form`
   - **Title:** `My First Form`
   - **Description:** `Testing the form builder`
   - Check **Is active**

3. Paste this JSON in the **Definition** field:
   ```json
   {
     "id": "my-first-form",
     "title": "My First Form",
     "description": "A simple test form",
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
         "placeholder": "Enter your name",
         "required": true,
         "validation": [{
           "type": "required",
           "message": "Please enter your name"
         }]
       }, {
         "id": "email",
         "type": "email",
         "name": "email",
         "label": "Email Address",
         "placeholder": "you@example.com",
         "required": true,
         "validation": [{
           "type": "required",
           "message": "Email is required"
         }, {
           "type": "email",
           "message": "Please enter a valid email"
         }]
       }]
     }]
   }
   ```

4. Click **Save**

5. View your form: http://127.0.0.1:8000/renderer/my-first-form/

### Method 2: Using the Visual Builder

1. Build the frontend components:
   ```bash
   cd ..  # to forms-poc root
   npm run build:builder
   ```

2. Open the builder: http://127.0.0.1:8000/builder/

3. Drag fields from the palette

4. Click fields to edit properties

5. Click "Export Form JSON"

6. Import the JSON to admin (see Method 1, step 3)

## 🎓 Learning Path

### Beginner (5 minutes)
1. ✅ Run setup script
2. ✅ View the 3 example forms
3. ✅ Submit a test form
4. ✅ Check submissions in admin

### Intermediate (15 minutes)
5. ✅ Create a simple form in admin
6. ✅ Test your form in the renderer
7. ✅ Add validation rules
8. ✅ View your submissions

### Advanced (30 minutes)
9. ✅ Create a multi-step form
10. ✅ Add conditional logic
11. ✅ Test the API endpoints
12. ✅ Customize the templates

## 🧪 Test the API

### Get Form Definition
```bash
curl http://127.0.0.1:8000/forms/api/forms/contact-form/
```

### Submit a Form
```bash
curl -X POST http://127.0.0.1:8000/forms/api/forms/contact-form/submit/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test submission from API"
  }'
```

### Validate Form Data
```bash
curl -X POST http://127.0.0.1:8000/forms/api/forms/contact-form/validate/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email"
  }'
```

## 🔍 View Submissions

1. Go to http://127.0.0.1:8000/admin/forms_builder/formsubmission/

2. Click on any submission to see:
   - Form data in a nice table format
   - Submission timestamp
   - User information
   - IP address

## 🎨 Customize the Look

### Edit Templates
Templates are in `demo_project/templates/`:
- `base.html` - Base layout with navigation
- `home.html` - Home page
- `forms/builder.html` - Builder page
- `forms/renderer.html` - Renderer page

### Modify Styles
Add custom CSS in the templates or create static CSS files.

### Change Colors
Edit the inline styles in `templates/base.html` to match your brand.

## 🐛 Troubleshooting

### Problem: Admin login fails
**Solution:** Create a superuser:
```bash
python manage.py createsuperuser
```

### Problem: Form not found (404)
**Solution:**
1. Check form ID in the URL matches the database
2. Ensure the form is marked "Is active" in admin
3. Reload fixtures: `python manage.py loaddata demo_project/fixtures/example_forms.json`

### Problem: Frontend components not loading
**Solution:** Build the components:
```bash
cd .. # to forms-poc root
npm install
npm run build:all
```

### Problem: Database errors
**Solution:** Reset the database:
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata demo_project/fixtures/example_forms.json
```

## 💡 Pro Tips

1. **Explore the Admin**: The Django admin is fully customized for forms management

2. **Check the Console**: Open browser DevTools to see validation and API calls

3. **Try Multi-Step**: The registration form shows off the wizard functionality

4. **Test Validation**: Try submitting forms with invalid data to see validation in action

5. **View Raw JSON**: In admin, look at the "Definition Preview" to see the form structure

## 📖 Next Steps

Once you're comfortable with the basics:

1. Read the [full README](./README.md) for detailed documentation
2. Check out [GETTING_STARTED.md](../GETTING_STARTED.md) for the complete project guide
3. Learn about [conditional logic](../JSONLOGIC_BUILDER.md)
4. Explore [NL Design System integration](../NL_DESIGN_SYSTEM.md)

## 🆘 Need Help?

- Check the [full README](./README.md)
- Review the [troubleshooting section](#-troubleshooting)
- Examine the example forms in `demo_project/fixtures/`
- Look at the Django admin for validation errors

## 🎉 Have Fun!

You now have a fully functional form builder system. Create, test, and iterate on your forms!

---

**Ready to dive deeper?** → [Read the Full Documentation](./README.md)
