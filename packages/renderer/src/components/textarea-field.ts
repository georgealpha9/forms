import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseField } from './base-field';
import type { TextareaField as TextareaFieldType } from '@forms-poc/shared';

/**
 * Textarea field component
 */
@customElement('form-textarea-field')
export class TextareaField extends BaseField {
  declare field: TextareaFieldType;

  render() {
    return html`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <textarea
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? 'error' : ''}"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ''}"
          ?required="${this.field.required}"
          rows="${this.field.rows || 3}"
          minlength="${this.field.minLength || ''}"
          maxlength="${this.field.maxLength || ''}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ''}"
        ></textarea>
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-textarea-field': TextareaField;
  }
}
