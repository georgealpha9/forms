import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseField } from './base-field';
import type { EmailField as EmailFieldType } from '@forms-poc/shared';

/**
 * Email input field component
 */
@customElement('form-email-field')
export class EmailField extends BaseField {
  declare field: EmailFieldType;

  render() {
    return html`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? 'error' : ''}"
          type="email"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ''}"
          ?required="${this.field.required}"
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
    'form-email-field': EmailField;
  }
}
