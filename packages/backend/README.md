# Django Forms Builder

A Django app for building and rendering dynamic forms with validation.

## Installation

```bash
pip install -e .
```

## Configuration

Add to your Django `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    'forms_builder',
]
```

Add to your `urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    # ...
    path('forms/', include('forms_builder.urls')),
]
```

Run migrations:

```bash
python manage.py migrate forms_builder
```

## Usage

### In Django Admin

1. Navigate to the Forms Builder section in Django admin
2. Create a new Form Definition
3. Use the visual form builder to design your form
4. Or import a JSON form definition from the frontend builder
5. Save and activate the form

### API Endpoints

#### Get Form Definition

```
GET /forms/api/forms/<form_id>/
```

Returns the form definition JSON.

#### Submit Form

```
POST /forms/api/forms/<form_id>/submit/
Content-Type: application/json

{
  "field_name": "value",
  ...
}
```

Validates and saves the form submission.

#### Validate Form

```
POST /forms/api/forms/<form_id>/validate/
Content-Type: application/json

{
  "field_name": "value",
  ...
}
```

Validates form data without saving.

## Models

### FormDefinition

Stores form definitions with:
- Title and description
- Multi-step configuration
- JSON definition
- Validation rules

### FormSubmission

Stores form submissions with:
- Submitted data
- User information
- IP address and user agent
- Timestamp

### FormValidationRule

Custom validation rules for forms.

## Validation

The package includes a comprehensive validation system that supports:

- Required fields
- Email validation
- Min/max length and value
- Pattern matching (regex)
- Custom validation rules
- Conditional logic using JSONLogic

## Example

```python
from forms_builder.models import FormDefinition
from forms_builder.validation import validate_form

# Get form
form = FormDefinition.objects.get(id='contact-form')

# Validate data
data = {
    'name': 'John Doe',
    'email': 'john@example.com'
}

is_valid, errors = validate_form(form.definition, data)

if is_valid:
    # Create submission
    form.submissions.create(data=data)
```
