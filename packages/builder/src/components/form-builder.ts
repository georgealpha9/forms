import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type {
  FormDefinition,
  FormField,
  FormStep,
  FieldType,
  TextField,
  EmailField,
  NumberField,
  TextareaField
} from '@forms-poc/shared';

import './field-palette';
import './field-editor';

/**
 * Main form builder component
 */
@customElement('form-builder')
export class FormBuilder extends LitElement {
  @state()
  private formDefinition: FormDefinition = {
    id: 'form-' + Date.now(),
    title: 'Untitled Form',
    description: '',
    isMultiStep: false,
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: '',
        order: 0,
        fields: []
      }
    ]
  };

  @state()
  private selectedField: FormField | null = null;

  @state()
  private currentStepIndex = 0;

  @state()
  private dragOverIndex: number | null = null;

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      background-color: #f9fafb;
    }

    .builder-container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      height: 100%;
      gap: 1rem;
      padding: 1rem;
    }

    .builder-sidebar {
      overflow-y: auto;
    }

    .builder-main {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
    }

    .builder-properties {
      overflow-y: auto;
    }

    .form-header-editor {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .form-checkbox input {
      width: 1.125rem;
      height: 1.125rem;
      cursor: pointer;
    }

    .form-checkbox label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
    }

    .steps-container {
      margin-bottom: 2rem;
    }

    .step-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .step-tab {
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.15s;
      margin-bottom: -2px;
    }

    .step-tab:hover {
      color: #111827;
    }

    .step-tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
    }

    .btn-add-step {
      padding: 0.5rem 1rem;
      background-color: #f3f4f6;
      border: 1px dashed #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      color: #6b7280;
    }

    .btn-add-step:hover {
      background-color: #e5e7eb;
      color: #374151;
    }

    .drop-zone {
      min-height: 200px;
      padding: 1rem;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      background-color: #f9fafb;
    }

    .drop-zone.drag-over {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .drop-zone-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #9ca3af;
      font-size: 0.875rem;
      text-align: center;
    }

    .field-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-item {
      padding: 1rem;
      background-color: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .field-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .field-item.selected {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .field-item.dragging {
      opacity: 0.5;
    }

    .field-item.drag-over-top {
      border-top-color: #3b82f6;
      border-top-width: 3px;
    }

    .field-item.drag-over-bottom {
      border-bottom-color: #3b82f6;
      border-bottom-width: 3px;
    }

    .field-handle {
      cursor: grab;
      color: #9ca3af;
      font-size: 1.25rem;
    }

    .field-handle:active {
      cursor: grabbing;
    }

    .field-content {
      flex: 1;
      min-width: 0;
    }

    .field-type {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 0.125rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
    }

    .btn-export {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 0.75rem 1.5rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .btn-export:hover {
      background-color: #2563eb;
    }
  `;

  private createField(type: FieldType, stepId: string): FormField {
    const id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const name = `${type}_${Date.now()}`;

    const baseField = {
      id,
      name,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      required: false
    };

    switch (type) {
      case 'text':
        return { ...baseField, type: 'text' } as TextField;
      case 'email':
        return { ...baseField, type: 'email' } as EmailField;
      case 'number':
        return { ...baseField, type: 'number' } as NumberField;
      case 'textarea':
        return { ...baseField, type: 'textarea', rows: 3 } as TextareaField;
    }
  }

  private handleFieldDragStart(event: DragEvent, field: FormField, index: number) {
    if (!event.dataTransfer) return;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify({
      action: 'reorder',
      fieldId: field.id,
      sourceIndex: index
    }));

    const target = event.currentTarget as HTMLElement;
    target.classList.add('dragging');
  }

  private handleFieldDragEnd(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    this.dragOverIndex = null;
  }

  private handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';
  }

  private handleDropZoneDragEnter(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  private handleDropZoneDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  private handleDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    if (!event.dataTransfer) return;

    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      const currentStep = this.formDefinition.steps[this.currentStepIndex];

      if (data.fieldType) {
        // Adding new field from palette
        const newField = this.createField(data.fieldType, currentStep.id);
        currentStep.fields = [...currentStep.fields, newField];
        this.selectedField = newField;
        this.requestUpdate();
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }

  private handleFieldDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) return;

    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      const currentStep = this.formDefinition.steps[this.currentStepIndex];

      if (data.action === 'reorder' && data.sourceIndex !== undefined) {
        // Reorder existing field
        const fields = [...currentStep.fields];
        const [movedField] = fields.splice(data.sourceIndex, 1);
        fields.splice(targetIndex, 0, movedField);
        currentStep.fields = fields;
        this.requestUpdate();
      } else if (data.fieldType) {
        // Add new field at specific position
        const newField = this.createField(data.fieldType, currentStep.id);
        const fields = [...currentStep.fields];
        fields.splice(targetIndex, 0, newField);
        currentStep.fields = fields;
        this.selectedField = newField;
        this.requestUpdate();
      }
    } catch (error) {
      console.error('Error handling field drop:', error);
    }

    this.dragOverIndex = null;
  }

  private handleFieldClick(field: FormField) {
    this.selectedField = field;
  }

  private handleFieldUpdate(event: CustomEvent) {
    const { fieldId, property, value } = event.detail;
    const currentStep = this.formDefinition.steps[this.currentStepIndex];
    const field = currentStep.fields.find(f => f.id === fieldId);

    if (field) {
      (field as any)[property] = value;
      this.requestUpdate();
    }
  }

  private handleFieldDelete(event: CustomEvent) {
    const { fieldId } = event.detail;
    const currentStep = this.formDefinition.steps[this.currentStepIndex];
    currentStep.fields = currentStep.fields.filter(f => f.id !== fieldId);

    if (this.selectedField?.id === fieldId) {
      this.selectedField = null;
    }

    this.requestUpdate();
  }

  private handleAddStep() {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: `Step ${this.formDefinition.steps.length + 1}`,
      description: '',
      order: this.formDefinition.steps.length,
      fields: []
    };

    this.formDefinition.steps = [...this.formDefinition.steps, newStep];
    this.currentStepIndex = this.formDefinition.steps.length - 1;
  }

  private handleExport() {
    const json = JSON.stringify(this.formDefinition, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-${this.formDefinition.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private renderFormHeader() {
    return html`
      <div class="form-header-editor">
        <div class="form-group">
          <label class="form-label">Form Title</label>
          <input
            type="text"
            class="form-input"
            .value="${this.formDefinition.title}"
            @input="${(e: Event) => {
              this.formDefinition.title = (e.target as HTMLInputElement).value;
              this.requestUpdate();
            }}"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            class="form-textarea"
            rows="2"
            .value="${this.formDefinition.description || ''}"
            @input="${(e: Event) => {
              this.formDefinition.description = (e.target as HTMLTextAreaElement).value;
              this.requestUpdate();
            }}"
          ></textarea>
        </div>

        <div class="form-checkbox">
          <input
            type="checkbox"
            id="multi-step"
            .checked="${this.formDefinition.isMultiStep}"
            @change="${(e: Event) => {
              this.formDefinition.isMultiStep = (e.target as HTMLInputElement).checked;
              this.requestUpdate();
            }}"
          />
          <label for="multi-step">Multi-step form</label>
        </div>
      </div>
    `;
  }

  private renderStepTabs() {
    if (!this.formDefinition.isMultiStep) return null;

    return html`
      <div class="steps-container">
        <div class="step-tabs">
          ${this.formDefinition.steps.map((step, index) => html`
            <button
              class="step-tab ${index === this.currentStepIndex ? 'active' : ''}"
              @click="${() => {
                this.currentStepIndex = index;
                this.selectedField = null;
              }}"
            >
              ${step.title}
            </button>
          `)}
          <button class="btn-add-step" @click="${this.handleAddStep}">
            + Add Step
          </button>
        </div>
      </div>
    `;
  }

  private renderDropZone() {
    const currentStep = this.formDefinition.steps[this.currentStepIndex];

    if (!currentStep.fields.length) {
      return html`
        <div
          class="drop-zone"
          @dragover="${this.handleDragOver}"
          @dragenter="${this.handleDropZoneDragEnter}"
          @dragleave="${this.handleDropZoneDragLeave}"
          @drop="${this.handleDrop}"
        >
          <div class="drop-zone-empty">
            Drag and drop fields here to build your form
          </div>
        </div>
      `;
    }

    return html`
      <div class="field-list">
        ${repeat(
          currentStep.fields,
          (field) => field.id,
          (field, index) => html`
            <div
              class="field-item ${this.selectedField?.id === field.id ? 'selected' : ''}"
              draggable="true"
              @dragstart="${(e: DragEvent) => this.handleFieldDragStart(e, field, index)}"
              @dragend="${this.handleFieldDragEnd}"
              @dragover="${this.handleDragOver}"
              @drop="${(e: DragEvent) => this.handleFieldDrop(e, index)}"
              @click="${() => this.handleFieldClick(field)}"
            >
              <div class="field-handle">⋮⋮</div>
              <div class="field-content">
                <div class="field-type">${field.type}</div>
                <div class="field-label">${field.label}</div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="builder-container">
        <div class="builder-sidebar">
          <field-palette></field-palette>
        </div>

        <div class="builder-main">
          ${this.renderFormHeader()}
          ${this.renderStepTabs()}
          ${this.renderDropZone()}
        </div>

        <div class="builder-properties">
          <field-editor
            .field="${this.selectedField}"
            @field-update="${this.handleFieldUpdate}"
            @field-delete="${this.handleFieldDelete}"
          ></field-editor>
        </div>
      </div>

      <button class="btn-export" @click="${this.handleExport}">
        Export Form JSON
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-builder': FormBuilder;
  }
}
