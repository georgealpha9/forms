import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FormField, TextField, NumberField, TextareaField } from '@forms-poc/shared';
import './logic/logic-modal';

/**
 * Field property editor
 */
@customElement('field-editor')
export class FieldEditor extends LitElement {
  @property({ attribute: false })
  set field(value: FormField | null) {
    const oldValue = this._field;
    this._field = value;
    console.log('Field property set:', value);
    this.requestUpdate('field', oldValue);
  }

  get field(): FormField | null {
    return this._field;
  }

  private _field: FormField | null = null;

  @property({ attribute: false }) allFields: FormField[] = [];

  @state() private isLogicModalOpen = false;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .editor-header {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .editor-empty {
      text-align: center;
      padding: 2rem 1rem;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.375rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 4rem;
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .form-checkbox input {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }

    .form-checkbox label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
    }

    .btn-delete {
      width: 100%;
      padding: 0.5rem;
      background-color: #dc2626;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
    }

    .btn-delete:hover {
      background-color: #b91c1c;
    }

    .logic-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 2px solid #e5e7eb;
    }

    .logic-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .logic-section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .logic-badge {
      padding: 0.25rem 0.5rem;
      background: #3b82f6;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 0.25rem;
    }

    .logic-badge.empty {
      background: #9ca3af;
    }

    .btn-logic {
      width: 100%;
      padding: 0.75rem;
      background: white;
      color: #3b82f6;
      border: 2px solid #3b82f6;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.15s;
    }

    .btn-logic:hover {
      background: #eff6ff;
    }

    .btn-logic-icon {
      font-size: 1.125rem;
    }

    .logic-summary {
      padding: 0.75rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-family: monospace;
      color: #4b5563;
      margin-bottom: 0.75rem;
      max-height: 100px;
      overflow-y: auto;
    }
  `;

  private handleChange(property: string, value: any) {
    if (!this.field) return;

    this.dispatchEvent(new CustomEvent('field-update', {
      detail: {
        fieldId: this.field.id,
        property,
        value
      },
      bubbles: true,
      composed: true
    }));
  }

  private handleDelete() {
    if (!this.field) return;

    this.dispatchEvent(new CustomEvent('field-delete', {
      detail: { fieldId: this.field.id },
      bubbles: true,
      composed: true
    }));
  }

  private handleOpenLogicModal() {
    console.log('Opening logic modal for field:', this.field);
    this.isLogicModalOpen = true;
    this.requestUpdate();
  }

  private handleCloseLogicModal() {
    this.isLogicModalOpen = false;
  }

  private handleLogicSave(e: CustomEvent) {
    if (!this.field) return;

    this.handleChange('conditionalLogic', e.detail.logic);
    this.isLogicModalOpen = false;
  }

  private renderCommonProperties() {
    if (!this.field) return null;

    return html`
      <div class="form-group">
        <label class="form-label">Label</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.label}"
          @input="${(e: Event) => this.handleChange('label', (e.target as HTMLInputElement).value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Field Name</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.name}"
          @input="${(e: Event) => this.handleChange('name', (e.target as HTMLInputElement).value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Placeholder</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.placeholder || ''}"
          @input="${(e: Event) => this.handleChange('placeholder', (e.target as HTMLInputElement).value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Help Text</label>
        <textarea
          class="form-textarea"
          .value="${this.field.helpText || ''}"
          @input="${(e: Event) => this.handleChange('helpText', (e.target as HTMLTextAreaElement).value)}"
        ></textarea>
      </div>

      <div class="form-checkbox">
        <input
          type="checkbox"
          id="required"
          .checked="${this.field.required || false}"
          @change="${(e: Event) => this.handleChange('required', (e.target as HTMLInputElement).checked)}"
        />
        <label for="required">Required</label>
      </div>
    `;
  }

  private renderTextFieldProperties() {
    const field = this.field as TextField;

    return html`
      <div class="form-group">
        <label class="form-label">Min Length</label>
        <input
          type="number"
          class="form-input"
          .value="${field.minLength?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('minLength', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Max Length</label>
        <input
          type="number"
          class="form-input"
          .value="${field.maxLength?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('maxLength', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Pattern (Regex)</label>
        <input
          type="text"
          class="form-input"
          .value="${field.pattern || ''}"
          @input="${(e: Event) => this.handleChange('pattern', (e.target as HTMLInputElement).value)}"
        />
      </div>
    `;
  }

  private renderNumberFieldProperties() {
    const field = this.field as NumberField;

    return html`
      <div class="form-group">
        <label class="form-label">Minimum Value</label>
        <input
          type="number"
          class="form-input"
          .value="${field.min?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('min', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Maximum Value</label>
        <input
          type="number"
          class="form-input"
          .value="${field.max?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('max', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Step</label>
        <input
          type="number"
          class="form-input"
          .value="${field.step?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('step', Number((e.target as HTMLInputElement).value))}"
        />
      </div>
    `;
  }

  private renderTextareaProperties() {
    const field = this.field as TextareaField;

    return html`
      <div class="form-group">
        <label class="form-label">Rows</label>
        <input
          type="number"
          class="form-input"
          .value="${field.rows?.toString() || '3'}"
          @input="${(e: Event) => this.handleChange('rows', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Min Length</label>
        <input
          type="number"
          class="form-input"
          .value="${field.minLength?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('minLength', Number((e.target as HTMLInputElement).value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Max Length</label>
        <input
          type="number"
          class="form-input"
          .value="${field.maxLength?.toString() || ''}"
          @input="${(e: Event) => this.handleChange('maxLength', Number((e.target as HTMLInputElement).value))}"
        />
      </div>
    `;
  }

  private renderTypeSpecificProperties() {
    if (!this.field) return null;

    switch (this.field.type) {
      case 'text':
        return this.renderTextFieldProperties();
      case 'number':
        return this.renderNumberFieldProperties();
      case 'textarea':
        return this.renderTextareaProperties();
      default:
        return null;
    }
  }

  render() {
    console.log('FieldEditor render, field:', this.field);

    if (!this.field) {
      return html`
        <div class="editor-header">Field Properties</div>
        <div class="editor-empty">
          Select a field to edit its properties
        </div>
      `;
    }

    // Get available fields excluding the current field for logic
    const availableFieldsForLogic = this.allFields.filter(f => f.id !== this.field?.id);
    const hasLogic = this.field.conditionalLogic && Object.keys(this.field.conditionalLogic).length > 0;

    return html`
      <div class="editor-header">Edit Field: ${this.field.type}</div>
      ${this.renderCommonProperties()}
      ${this.renderTypeSpecificProperties()}

      <div class="logic-section">
        <div class="logic-section-header">
          <span class="logic-section-title">Conditional Logic</span>
          <span class="logic-badge ${hasLogic ? '' : 'empty'}">
            ${hasLogic ? 'Active' : 'None'}
          </span>
        </div>

        ${hasLogic ? html`
          <div class="logic-summary">
            ${JSON.stringify(this.field.conditionalLogic, null, 2)}
          </div>
        ` : ''}

        <button class="btn-logic" @click="${this.handleOpenLogicModal}">
          <span class="btn-logic-icon">⚙</span>
          <span>${hasLogic ? 'Edit' : 'Add'} Conditional Logic</span>
        </button>
      </div>

      <button class="btn-delete" @click="${this.handleDelete}">
        Delete Field
      </button>

      <logic-modal
        .open="${this.isLogicModalOpen}"
        .availableFields="${availableFieldsForLogic}"
        .initialLogic="${this.field.conditionalLogic || null}"
        .fieldLabel="${this.field.label}"
        @logic-save="${this.handleLogicSave}"
        @modal-close="${this.handleCloseLogicModal}"
      ></logic-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'field-editor': FieldEditor;
  }
}
