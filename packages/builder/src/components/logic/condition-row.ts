import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FormField, LogicNode } from '@forms-poc/shared';

/**
 * Single condition row in the logic builder
 */
@customElement('condition-row')
export class ConditionRow extends LitElement {
  @property({ attribute: false }) node!: LogicNode;
  @property({ attribute: false }) availableFields: FormField[] = [];

  static styles = css`
    :host {
      display: block;
      margin-bottom: 0.5rem;
    }

    .condition-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }

    .condition-row:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    select, input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
    }

    select:focus, input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .field-select {
      flex: 1;
      min-width: 150px;
    }

    .operator-select {
      min-width: 140px;
    }

    .value-input {
      flex: 1;
      min-width: 150px;
    }

    .btn-remove {
      padding: 0.5rem 0.75rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-remove:hover {
      background: #dc2626;
    }

    .unary-operator {
      color: #6b7280;
      font-style: italic;
    }
  `;

  private handleFieldChange(e: Event) {
    const field = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('condition-change', {
      detail: { ...this.node, field },
      bubbles: true,
      composed: true
    }));
  }

  private handleOperatorChange(e: Event) {
    const operator = (e.target as HTMLSelectElement).value as LogicNode['operator'];
    const isUnary = operator === 'isEmpty' || operator === 'isNotEmpty';

    this.dispatchEvent(new CustomEvent('condition-change', {
      detail: {
        ...this.node,
        operator,
        // Clear value for unary operators
        ...(isUnary ? { value: undefined } : {})
      },
      bubbles: true,
      composed: true
    }));
  }

  private handleValueChange(e: Event) {
    const input = e.target as HTMLInputElement;
    let value: string | number = input.value;

    // Convert to number if the field is a number type
    const selectedField = this.availableFields.find(f => f.name === this.node.field);
    if (selectedField?.type === 'number') {
      value = Number(value);
    }

    this.dispatchEvent(new CustomEvent('condition-change', {
      detail: { ...this.node, value },
      bubbles: true,
      composed: true
    }));
  }

  private handleRemove() {
    this.dispatchEvent(new CustomEvent('condition-remove', {
      detail: { id: this.node.id },
      bubbles: true,
      composed: true
    }));
  }

  private isUnaryOperator(): boolean {
    return this.node.operator === 'isEmpty' || this.node.operator === 'isNotEmpty';
  }

  private getOperatorLabel(op: string): string {
    const labels: Record<string, string> = {
      '==': 'equals',
      '!=': 'not equals',
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater or equal',
      '<=': 'less or equal',
      'contains': 'contains',
      'startsWith': 'starts with',
      'endsWith': 'ends with',
      'isEmpty': 'is empty',
      'isNotEmpty': 'is not empty',
      'in': 'is in list'
    };
    return labels[op] || op;
  }

  render() {
    const isUnary = this.isUnaryOperator();

    return html`
      <div class="condition-row">
        <select
          class="field-select"
          .value="${this.node.field || ''}"
          @change="${this.handleFieldChange}"
        >
          <option value="">Select field...</option>
          ${this.availableFields.map(field => html`
            <option value="${field.name}">${field.label}</option>
          `)}
        </select>

        <select
          class="operator-select"
          .value="${this.node.operator}"
          @change="${this.handleOperatorChange}"
        >
          <optgroup label="Comparison">
            <option value="==">${this.getOperatorLabel('==')}</option>
            <option value="!=">${this.getOperatorLabel('!=')}</option>
            <option value=">">${this.getOperatorLabel('>')}</option>
            <option value="<">${this.getOperatorLabel('<')}</option>
            <option value=">=">${this.getOperatorLabel('>=')}</option>
            <option value="<=">${this.getOperatorLabel('<=')}</option>
          </optgroup>
          <optgroup label="String">
            <option value="contains">${this.getOperatorLabel('contains')}</option>
            <option value="startsWith">${this.getOperatorLabel('startsWith')}</option>
            <option value="endsWith">${this.getOperatorLabel('endsWith')}</option>
          </optgroup>
          <optgroup label="Check">
            <option value="isEmpty">${this.getOperatorLabel('isEmpty')}</option>
            <option value="isNotEmpty">${this.getOperatorLabel('isNotEmpty')}</option>
          </optgroup>
        </select>

        ${isUnary ? html`
          <span class="unary-operator">(no value needed)</span>
        ` : html`
          <input
            type="text"
            class="value-input"
            .value="${this.node.value?.toString() || ''}"
            @input="${this.handleValueChange}"
            placeholder="Value..."
          />
        `}

        <button class="btn-remove" @click="${this.handleRemove}">
          Remove
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'condition-row': ConditionRow;
  }
}
