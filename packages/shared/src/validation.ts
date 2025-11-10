import type { FormField, ValidationRule, ValidationResult, ValidationError, FormData } from './types';

/**
 * Validates a single field value against its validation rules
 */
export function validateField(field: FormField, value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!field.validation) {
    return errors;
  }

  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push({ field: field.name, message: rule.message });
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          errors.push({ field: field.name, message: rule.message });
        }
        break;

      case 'min':
        if (rule.value !== undefined) {
          if (field.type === 'number' && Number(value) < Number(rule.value)) {
            errors.push({ field: field.name, message: rule.message });
          } else if (typeof value === 'string' && value.length < Number(rule.value)) {
            errors.push({ field: field.name, message: rule.message });
          }
        }
        break;

      case 'max':
        if (rule.value !== undefined) {
          if (field.type === 'number' && Number(value) > Number(rule.value)) {
            errors.push({ field: field.name, message: rule.message });
          } else if (typeof value === 'string' && value.length > Number(rule.value)) {
            errors.push({ field: field.name, message: rule.message });
          }
        }
        break;

      case 'pattern':
        if (rule.value && value) {
          const regex = new RegExp(String(rule.value));
          if (!regex.test(String(value))) {
            errors.push({ field: field.name, message: rule.message });
          }
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push({ field: field.name, message: rule.message });
        }
        break;
    }
  }

  return errors;
}

/**
 * Validates all fields in a form step
 */
export function validateForm(fields: FormField[], data: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const value = data[field.name];
    const fieldErrors = validateField(field, value);
    errors.push(...fieldErrors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
