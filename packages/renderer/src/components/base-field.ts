import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import type { FormField, ValidationError } from '@forms-poc/shared';

/**
 * Base class for all form field components
 */
export abstract class BaseField extends LitElement {
  @property({ type: Object })
  field!: FormField;

  @property({ type: String })
  value: string | number = '';

  @property({ type: Array })
  errors: ValidationError[] = [];

  @property({ type: Boolean })
  hidden = false;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    :host([hidden]) {
      display: none;
    }

    .field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .field-label {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .field-label.required::after {
      content: ' *';
      color: #dc2626;
    }

    .field-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      line-height: 1.5;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .field-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .field-input.error {
      border-color: #dc2626;
    }

    .field-input.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .field-help {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .field-errors {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .field-error {
      font-size: 0.75rem;
      color: #dc2626;
    }
  `;

  protected handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: {
        name: this.field.name,
        value: this.value
      },
      bubbles: true,
      composed: true
    }));
  }

  protected renderLabel() {
    return html`
      <label
        class="field-label ${this.field.required ? 'required' : ''}"
        for="${this.field.id}"
      >
        ${this.field.label}
      </label>
    `;
  }

  protected renderHelp() {
    if (!this.field.helpText) return null;
    return html`<div class="field-help">${this.field.helpText}</div>`;
  }

  protected renderErrors() {
    const fieldErrors = this.errors.filter(e => e.field === this.field.name);
    if (fieldErrors.length === 0) return null;

    return html`
      <div class="field-errors">
        ${fieldErrors.map(error => html`
          <div class="field-error">${error.message}</div>
        `)}
      </div>
    `;
  }

  protected hasErrors(): boolean {
    return this.errors.some(e => e.field === this.field.name);
  }
}
