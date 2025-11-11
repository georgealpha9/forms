# Form Builder Demo Examples

## Quick Start

1. **Run the basic example:**
   ```bash
   npm run dev:builder
   ```
   Then open http://localhost:5173 (or the port shown in your terminal)

2. **Run the comprehensive demo:**
   Navigate to `http://localhost:5173/demo.html` in your browser

## Available Examples

### 1. Basic Example (index.html)
A simple contact form demonstrating:
- Text field with validation
- Email field with validation  
- Number field
- Textarea field with min length

### 2. Comprehensive Demo (demo.html)
A complete showcase of ALL features:
- **All 4 field types:** text, email, number, textarea
- **Validation rules:** required, min/max length, min/max values, pattern matching
- **Conditional logic:** Fields that show/hide based on other field values
- **Multi-step forms:** Toggle to create wizard-style forms
- **Help text:** User guidance for each field
- **Field properties:** Placeholder, default values, step increments

## Field Types & Features

### Text Field
```javascript
{
  type: 'text',
  name: 'field_name',
  label: 'Field Label',
  placeholder: 'Placeholder text',
  required: true,
  minLength: 5,
  maxLength: 100,
  pattern: '^[A-Za-z]+$',  // Regex pattern
  helpText: 'Helper text for users'
}
```

### Email Field
```javascript
{
  type: 'email',
  name: 'email',
  label: 'Email Address',
  placeholder: 'you@example.com',
  required: true,
  helpText: 'We will never share your email'
}
```

### Number Field
```javascript
{
  type: 'number',
  name: 'age',
  label: 'Age',
  min: 18,
  max: 120,
  step: 1,
  required: true
}
```

### Textarea Field
```javascript
{
  type: 'textarea',
  name: 'message',
  label: 'Message',
  rows: 5,
  minLength: 10,
  maxLength: 500,
  required: true
}
```

## Conditional Logic Examples

### Simple Condition (Show field if another field has value)
```javascript
conditionalLogic: {
  "!=": [
    { "var": "field_name" },
    ""
  ]
}
```

### Age-based Condition
```javascript
conditionalLogic: {
  ">=": [
    { "var": "age" },
    21
  ]
}
```

### Complex AND Condition
```javascript
conditionalLogic: {
  "and": [
    { ">=": [{ "var": "age" }, 25] },
    { "!=": [{ "var": "experience" }, ""] }
  ]
}
```

### Complex OR Condition
```javascript
conditionalLogic: {
  "or": [
    { "==": [{ "var": "status" }, "employed"] },
    { ">=": [{ "var": "age" }, 30] }
  ]
}
```

## Multi-Step Forms

Enable multi-step mode by setting `isMultiStep: true`:

```javascript
{
  isMultiStep: true,
  steps: [
    {
      id: 'step-1',
      title: 'Personal Info',
      description: 'Basic information',
      order: 0,
      fields: [...]
    },
    {
      id: 'step-2', 
      title: 'Contact Details',
      description: 'How to reach you',
      order: 1,
      fields: [...]
    }
  ]
}
```

## Using the Builder

1. **Add Fields:** Click or drag fields from the left palette
2. **Edit Fields:** Click on a field in the canvas to edit in the right panel
3. **Reorder Fields:** Drag and drop fields to reorder
4. **Delete Fields:** Select a field and click delete in the properties panel
5. **Add Conditional Logic:** Select a field and add conditions in the Logic tab
6. **Multi-step:** Check "Multi-step form" checkbox and use "Add Step" button

## Integration with Django

The form builder automatically emits a `definition-change` event whenever the form is modified:

```javascript
const builder = document.querySelector('form-builder');
builder.addEventListener('definition-change', (event) => {
  const formDefinition = event.detail.definition;
  // Send to Django backend
  saveToBackend(formDefinition);
});
```

## JSONLogic Operators Supported

- `==` - Equals
- `!=` - Not equals
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal
- `<=` - Less than or equal
- `and` - Logical AND
- `or` - Logical OR
- `!` - Logical NOT

See [JSONLogic documentation](https://jsonlogic.com) for more details.

## Tips

- The comprehensive demo (`demo.html`) shows ALL possible combinations
- Use conditional logic to create dynamic, context-aware forms
- Pattern validation works with standard JavaScript regex
- Help text appears below fields to guide users
- Required fields are validated before submission
