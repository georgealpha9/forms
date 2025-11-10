# NL Design System Integration Guide

The form renderer is designed with accessibility in mind and is ready to integrate with NL Design System components.

## Current Implementation

The form components currently use semantic HTML with ARIA attributes for accessibility:

- Proper form labels with `for` attributes
- ARIA attributes (`aria-invalid`, `aria-describedby`)
- Semantic HTML elements
- Keyboard navigation support
- Screen reader friendly error messages

## Integration Options

### Option 1: Utrecht Design System

Utrecht is a popular implementation of the NL Design System architecture.

```bash
npm install @utrecht/component-library-css @utrecht/design-tokens
```

Then modify the field components to use Utrecht classes:

```typescript
import '@utrecht/component-library-css';

// In your component styles
.field-input {
  @apply utrecht-textbox;
}
```

### Option 2: Amsterdam Design System

```bash
npm install @amsterdam/design-system-react
```

### Option 3: Custom NL Design System Theme

You can create custom CSS that follows NL Design System guidelines:

```css
/* packages/renderer/src/styles/nl-design.css */
:root {
  /* Colors from NL Design System */
  --nl-color-primary: #01689b;
  --nl-color-error: #d52b1e;
  --nl-color-success: #39870c;

  /* Typography */
  --nl-font-family: 'RO Sans', sans-serif;
  --nl-font-size-base: 1rem;
  --nl-line-height: 1.5;

  /* Spacing */
  --nl-space-xs: 0.25rem;
  --nl-space-sm: 0.5rem;
  --nl-space-md: 1rem;
  --nl-space-lg: 1.5rem;
}
```

## Accessibility Features Already Implemented

### Form Fields

- ✅ Labels associated with inputs
- ✅ Required field indicators
- ✅ Help text with proper ARIA relationships
- ✅ Error messages announced to screen readers
- ✅ Focus management
- ✅ Keyboard navigation

### Form Structure

- ✅ Semantic HTML structure
- ✅ Logical tab order
- ✅ Clear visual hierarchy
- ✅ Progress indicators for multi-step forms

### Validation

- ✅ Real-time validation feedback
- ✅ Clear error messages
- ✅ Error summary for screen readers
- ✅ Visual error indicators

## Next Steps for Full NL Design System Compliance

### 1. Choose a Design System

Decide which implementation to use:
- Utrecht (most mature)
- Amsterdam
- Custom implementation

### 2. Install Design Tokens

```bash
npm install @utrecht/design-tokens
# or
npm install @amsterdam/design-tokens
```

### 3. Update Component Styles

Modify `packages/renderer/src/components/base-field.ts` to use design system classes and tokens.

### 4. Test Accessibility

Use tools like:
- NVDA or JAWS screen readers
- axe DevTools
- WAVE browser extension
- Lighthouse accessibility audit

### 5. Validate Against WCAG 2.1 AA

Ensure compliance with:
- Color contrast ratios
- Focus indicators
- Keyboard navigation
- Screen reader compatibility
- Touch target sizes

## Example: Integrating Utrecht

### 1. Install Dependencies

```bash
cd packages/renderer
npm install @utrecht/component-library-css @utrecht/design-tokens
```

### 2. Import Styles

```typescript
// packages/renderer/src/index.ts
import '@utrecht/component-library-css/dist/index.css';
```

### 3. Update Field Components

```typescript
// Example: text-field.ts
render() {
  return html`
    <div class="utrecht-form-field">
      <label class="utrecht-form-label ${this.field.required ? 'utrecht-form-label--required' : ''}">
        ${this.field.label}
      </label>
      <input
        class="utrecht-textbox ${this.hasErrors() ? 'utrecht-textbox--invalid' : ''}"
        type="text"
        .value="${this.value}"
        ?required="${this.field.required}"
        @input="${this.handleInput}"
      />
      ${this.field.helpText ? html`
        <p class="utrecht-form-field-description">${this.field.helpText}</p>
      ` : null}
      ${this.hasErrors() ? html`
        <p class="utrecht-form-field-error-message">${this.renderErrors()}</p>
      ` : null}
    </div>
  `;
}
```

## Resources

- [NL Design System Documentation](https://nldesignsystem.nl/)
- [Utrecht Storybook](https://nl-design-system.github.io/utrecht/storybook/)
- [Amsterdam Design System](https://designsystem.amsterdam.nl/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Dutch Government Accessibility Requirements](https://www.digitoegankelijk.nl/)

## Testing Checklist

- [ ] Test with keyboard only
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Test color contrast
- [ ] Test on mobile devices
- [ ] Validate HTML
- [ ] Run axe DevTools audit
- [ ] Test with form auto-fill
- [ ] Test error handling
- [ ] Test multi-step navigation
- [ ] Verify ARIA attributes
