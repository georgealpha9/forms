import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  FormDefinition,
  FormData,
  ValidationError,
  FormField,
  FormStep
} from '@forms-poc/shared';
import { validateForm, evaluateLogic } from '@forms-poc/shared';

import './text-field';
import './email-field';
import './number-field';
import './textarea-field';

/**
 * Main form renderer component
 * Handles single and multi-step forms with conditional logic
 */
@customElement('form-renderer')
export class FormRenderer extends LitElement {
  @property({ type: Object })
  definition!: FormDefinition;

  @state()
  private formData: FormData = {};

  @state()
  private errors: ValidationError[] = [];

  @state()
  private currentStepIndex = 0;

  @state()
  private isSubmitting = false;

  static styles = css`
    :host {
      display: block;
      max-width: 42rem;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .form-description {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    .form-step {
      margin-bottom: 2rem;
    }

    .step-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .step-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .step-progress {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .progress-step {
      flex: 1;
      height: 0.5rem;
      background-color: #e5e7eb;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }

    .progress-step.active,
    .progress-step.completed {
      background-color: #3b82f6;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    .form-success {
      padding: 1rem;
      background-color: #d1fae5;
      border: 1px solid #10b981;
      border-radius: 0.375rem;
      color: #065f46;
      text-align: center;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('field-change', this.handleFieldChange as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('field-change', this.handleFieldChange as EventListener);
  }

  private handleFieldChange(event: CustomEvent) {
    const { name, value } = event.detail;
    this.formData = { ...this.formData, [name]: value };
    // Clear errors for this field when it changes
    this.errors = this.errors.filter(e => e.field !== name);
  }

  private getCurrentStep(): FormStep | null {
    const visibleSteps = this.getVisibleSteps();
    return visibleSteps[this.currentStepIndex] || null;
  }

  private getVisibleSteps(): FormStep[] {
    if (!this.definition?.steps) return [];
    return this.definition.steps
      .filter(step => this.isStepVisible(step))
      .sort((a, b) => a.order - b.order);
  }

  private isStepVisible(step: FormStep): boolean {
    if (!step.conditionalLogic) return true;
    return evaluateLogic(step.conditionalLogic, this.formData);
  }

  private isFieldVisible(field: FormField): boolean {
    if (!field.conditionalLogic) return true;
    return evaluateLogic(field.conditionalLogic, this.formData);
  }

  private async handleNext() {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    // Validate current step
    const visibleFields = currentStep.fields.filter(f => this.isFieldVisible(f));
    const validation = validateForm(visibleFields, this.formData);

    if (!validation.valid) {
      this.errors = validation.errors;
      return;
    }

    this.errors = [];
    const visibleSteps = this.getVisibleSteps();

    if (this.currentStepIndex < visibleSteps.length - 1) {
      this.currentStepIndex++;
    }
  }

  private handlePrevious() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.errors = [];
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    // Validate current step
    const visibleFields = currentStep.fields.filter(f => this.isFieldVisible(f));
    const validation = validateForm(visibleFields, this.formData);

    if (!validation.valid) {
      this.errors = validation.errors;
      return;
    }

    this.isSubmitting = true;
    this.errors = [];

    try {
      if (this.definition.onSubmit) {
        await this.definition.onSubmit(this.formData);
      }

      this.dispatchEvent(new CustomEvent('form-submit', {
        detail: { data: this.formData },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Form submission error:', error);
      this.errors = [{ field: '_form', message: 'An error occurred while submitting the form' }];
    } finally {
      this.isSubmitting = false;
    }
  }

  private renderField(field: FormField) {
    if (!this.isFieldVisible(field)) return null;

    const value = this.formData[field.name] || field.defaultValue || '';

    switch (field.type) {
      case 'text':
        return html`<form-text-field
          .field="${field}"
          .value="${value}"
          .errors="${this.errors}"
        ></form-text-field>`;

      case 'email':
        return html`<form-email-field
          .field="${field}"
          .value="${value}"
          .errors="${this.errors}"
        ></form-email-field>`;

      case 'number':
        return html`<form-number-field
          .field="${field}"
          .value="${value}"
          .errors="${this.errors}"
        ></form-number-field>`;

      case 'textarea':
        return html`<form-textarea-field
          .field="${field}"
          .value="${value}"
          .errors="${this.errors}"
        ></form-textarea-field>`;

      default:
        return null;
    }
  }

  private renderProgress() {
    if (!this.definition.isMultiStep) return null;

    const visibleSteps = this.getVisibleSteps();

    return html`
      <div class="step-progress">
        ${visibleSteps.map((_, index) => html`
          <div class="progress-step ${
            index < this.currentStepIndex ? 'completed' :
            index === this.currentStepIndex ? 'active' : ''
          }"></div>
        `)}
      </div>
    `;
  }

  private renderStepHeader(step: FormStep) {
    if (!this.definition.isMultiStep) return null;

    return html`
      <div class="step-header">
        <h2 class="step-title">${step.title}</h2>
        ${step.description ? html`
          <p class="step-description">${step.description}</p>
        ` : null}
      </div>
    `;
  }

  private renderActions() {
    const visibleSteps = this.getVisibleSteps();
    const isLastStep = this.currentStepIndex === visibleSteps.length - 1;
    const isFirstStep = this.currentStepIndex === 0;

    return html`
      <div class="form-actions">
        ${this.definition.isMultiStep && !isFirstStep ? html`
          <button
            type="button"
            class="btn btn-secondary"
            @click="${this.handlePrevious}"
            ?disabled="${this.isSubmitting}"
          >
            Previous
          </button>
        ` : null}

        ${isLastStep ? html`
          <button
            type="submit"
            class="btn btn-primary"
            ?disabled="${this.isSubmitting}"
          >
            ${this.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        ` : html`
          <button
            type="button"
            class="btn btn-primary"
            @click="${this.handleNext}"
          >
            Next
          </button>
        `}
      </div>
    `;
  }

  render() {
    if (!this.definition) {
      return html`<div>No form definition provided</div>`;
    }

    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return html`<div>No visible steps in form</div>`;
    }

    return html`
      <form @submit="${this.handleSubmit}">
        <div class="form-header">
          <h1 class="form-title">${this.definition.title}</h1>
          ${this.definition.description ? html`
            <p class="form-description">${this.definition.description}</p>
          ` : null}
        </div>

        ${this.renderProgress()}

        <div class="form-step">
          ${this.renderStepHeader(currentStep)}

          <div class="form-fields">
            ${currentStep.fields.map(field => this.renderField(field))}
          </div>
        </div>

        ${this.renderActions()}
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-renderer': FormRenderer;
  }
}
