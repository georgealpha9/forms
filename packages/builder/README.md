# Form Builder Examples - Quick Reference

## 🚀 Getting Started

```bash
npm run dev:builder
```

Then open your browser to the URL shown (usually http://localhost:5173)

## 📋 Available Examples

### 1. **index.html** - Basic Example
- Simple contact form with 4 fields
- Great starting point for beginners
- Shows: text, email, number, textarea fields

### 2. **demo.html** - Comprehensive Demo  
- **ALL field types with ALL features**
- Validation rules (min/max, patterns, required)
- Conditional logic examples
- Help text and placeholders
- **This is the best example to see everything!**

### 3. **multistep.html** - Multi-Step Wizard
- Job application wizard with 3 steps
- Shows how to create multi-step forms
- Step navigation and conditional fields across steps

## 🎯 What You Can Do

### Add Fields
- **Drag & Drop:** Drag fields from left palette to canvas
- **Click:** Click field types in palette to add to bottom

### Edit Fields  
- Click any field in the canvas
- Right panel shows all editable properties
- Changes save automatically

### Reorder Fields
- Drag fields up/down in the canvas to reorder

### Delete Fields
- Select field → Click "Delete Field" in properties panel

### Add Conditional Logic
- Select a field
- Click "Logic" tab in properties panel  
- Add conditions for when field should show/hide

### Multi-Step Forms
- Check "Multi-step form" checkbox
- Click "+ Add Step" to create new steps
- Drag fields to each step

## 📚 Field Types Reference

| Type | Purpose | Special Properties |
|------|---------|-------------------|
| **text** | Single-line text | minLength, maxLength, pattern |
| **email** | Email addresses | Automatic validation |
| **number** | Numeric input | min, max, step |
| **textarea** | Multi-line text | rows, minLength, maxLength |

## 🔧 All Available Properties

Every field can have:
- ✅ **label** - Display label
- ✅ **name** - Field identifier (must be unique)
- ✅ **placeholder** - Hint text
- ✅ **required** - Mark as required
- ✅ **helpText** - User guidance text
- ✅ **defaultValue** - Pre-filled value
- ✅ **conditionalLogic** - Show/hide rules

## 💡 Conditional Logic Examples

### Show field if another field has any value:
```javascript
conditionalLogic: {
  "!=": [{ "var": "other_field_name" }, ""]
}
```

### Show field if age >= 21:
```javascript
conditionalLogic: {
  ">=": [{ "var": "age" }, 21]
}
```

### Show field if employed OR age > 30:
```javascript
conditionalLogic: {
  "or": [
    { "==": [{ "var": "employment_status" }, "employed"] },
    { ">": [{ "var": "age" }, 30] }
  ]
}
```

### Show field if age >= 25 AND has experience:
```javascript
conditionalLogic: {
  "and": [
    { ">=": [{ "var": "age" }, 25] },
    { "!=": [{ "var": "work_experience" }, ""] }
  ]
}
```

## 🎨 Pattern Validation Examples

### Phone Number:
```javascript
pattern: "^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$"
```

### URL (http/https):
```javascript
pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
```

### Letters only:
```javascript
pattern: "^[A-Za-z]+$"
```

### Alphanumeric:
```javascript
pattern: "^[A-Za-z0-9]+$"
```

## 📊 Complete Form Structure

```javascript
{
  id: 'unique-form-id',
  title: 'Form Title',
  description: 'Form description',
  isMultiStep: false,  // true for wizard-style forms
  steps: [
    {
      id: 'step-1',
      title: 'Step Title',
      description: 'Step description',
      order: 0,
      fields: [
        {
          id: 'field-1',
          type: 'text',
          name: 'field_name',
          label: 'Field Label',
          placeholder: 'Placeholder...',
          required: true,
          helpText: 'Help text',
          minLength: 5,
          maxLength: 100,
          conditionalLogic: { /* JSONLogic */ }
        }
        // ... more fields
      ]
    }
    // ... more steps (if multi-step)
  ]
}
```

## 🔍 Where to See Examples

1. **See basic usage:** Open `index.html` - simple contact form
2. **See ALL features:** Open `demo.html` - comprehensive showcase  
3. **See multi-step:** Open `multistep.html` - wizard example
4. **Read docs:** Check `DEMO_EXAMPLES.md` for detailed explanations

## 💾 Export/Integration

The builder emits events that can be captured for Django integration:

```javascript
const builder = document.querySelector('form-builder');

builder.addEventListener('definition-change', (event) => {
  const formDefinition = event.detail.definition;
  console.log('Form changed:', formDefinition);
  
  // Send to backend
  fetch('/api/save-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formDefinition)
  });
});
```

## 🐛 Troubleshooting

**Empty page?** 
- The examples now have pre-loaded data
- Try refreshing the page
- Check browser console for errors

**Fields not appearing?**
- Make sure you're using a modern browser
- Check that JavaScript is enabled
- Look for console errors

**Can't drag fields?**
- Try clicking the field type instead
- Ensure you're dragging from the palette (left side)
- Drop in the center canvas area

## 📖 More Information

- See `DEMO_EXAMPLES.md` for detailed field documentation
- See `JSONLOGIC_BUILDER.md` for conditional logic details  
- See `PROJECT_SUMMARY.md` for overall architecture

---

**Pro Tip:** Start with `demo.html` to see everything in action! 🚀
