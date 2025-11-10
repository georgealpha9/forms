import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseField } from './base-field';
import type { NumberField as NumberFieldType } from '@forms-poc/shared';

/**
 * Number input field component
 */
@customElement('form-number-field')
export class NumberField extends BaseField {
  declare field: NumberFieldType;

  render() {
    return html`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? 'error' : ''}"
          type="number"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ''}"
          ?required="${this.field.required}"
          min="${this.field.min ?? ''}"
          max="${this.field.max ?? ''}"
          step="${this.field.step ?? ''}"
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
    'form-number-field': NumberField;
  }
}
