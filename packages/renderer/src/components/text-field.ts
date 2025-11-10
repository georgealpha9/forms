import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseField } from './base-field';
import type { TextField as TextFieldType } from '@forms-poc/shared';

/**
 * Text input field component
 */
@customElement('form-text-field')
export class TextField extends BaseField {
  declare field: TextFieldType;

  render() {
    return html`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? 'error' : ''}"
          type="text"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ''}"
          ?required="${this.field.required}"
          minlength="${this.field.minLength || ''}"
          maxlength="${this.field.maxLength || ''}"
          pattern="${this.field.pattern || ''}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ''}"
        />
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-text-field': TextField;
  }
}
