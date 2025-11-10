import type { RulesLogic } from 'json-logic-js';

/**
 * Supported form field types
 */
export type FieldType = 'text' | 'email' | 'number' | 'textarea';

/**
 * Base field configuration
 */
export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  helpText?: string;
  validation?: ValidationRule[];
  conditionalLogic?: RulesLogic;
}

/**
 * Text field configuration
 */
export interface TextField extends BaseField {
  type: 'text';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

/**
 * Email field configuration
 */
export interface EmailField extends BaseField {
  type: 'email';
}

/**
 * Number field configuration
 */
export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Textarea field configuration
 */
export interface TextareaField extends BaseField {
  type: 'textarea';
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Union type of all field types
 */
export type FormField = TextField | EmailField | NumberField | TextareaField;

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  value?: string | number;
  validator?: (value: any) => boolean;
}

/**
 * Form step configuration for multi-step wizards
 */
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditionalLogic?: RulesLogic;
  order: number;
}

/**
 * Complete form definition
 */
export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
  isMultiStep: boolean;
  submitUrl?: string;
  onSubmit?: (data: FormData) => void | Promise<void>;
}

/**
 * Form field value type
 */
export type FieldValue = string | number | boolean | null;

/**
 * Form data structure
 */
export type FormData = Record<string, FieldValue>;

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Logic builder node for visual JSONLogic editing
 */
export interface LogicNode {
  id: string;
  operator: 'and' | 'or' | 'not' | '==' | '!=' | '>' | '<' | '>=' | '<=';
  children?: LogicNode[];
  field?: string;
  value?: FieldValue;
}
