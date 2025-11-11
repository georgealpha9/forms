import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FormField } from '@forms-poc/shared';
import type { RulesLogic } from 'json-logic-js';
import './logic-builder';

/**
 * Modal dialog for editing conditional logic
 */
@customElement('logic-modal')
export class LogicModal extends LitElement {
  @property({ attribute: false, reflect: true }) open = false;
  @property({ attribute: false }) availableFields: FormField[] = [];
  @property({ attribute: false }) initialLogic: RulesLogic | null = null;
  @property({ type: String }) fieldLabel = '';

  @state() private _currentLogic: RulesLogic | null;

  constructor() {
    super();
    this._currentLogic = null;
  }

  private get currentLogic(): RulesLogic | null {
    return this._currentLogic;
  }

  private set currentLogic(value: RulesLogic | null) {
    this._currentLogic = value;
  }

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
      padding: 2rem;
      overflow-y: auto;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
      margin: auto;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .field-name {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .btn-close {
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: transparent;
      color: #6b7280;
      font-size: 1.5rem;
      cursor: pointer;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .btn-close:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-cancel {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-cancel:hover {
      background: #f9fafb;
    }

    .btn-save {
      background: #3b82f6;
      color: white;
    }

    .btn-save:hover {
      background: #2563eb;
    }

    .btn-save:active {
      background: #1d4ed8;
    }

    .info-message {
      padding: 1rem;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 0.375rem;
      margin-bottom: 1.5rem;
    }

    .info-message p {
      margin: 0;
      font-size: 0.875rem;
      color: #1e40af;
    }

    .info-message strong {
      color: #1e3a8a;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.currentLogic = this.initialLogic;
    // Add ESC key listener
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open')) {
      // Prevent body scroll when modal is open
      if (this.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    if (changedProperties.has('initialLogic')) {
      this.currentLogic = this.initialLogic;
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open) {
      this.handleCancel();
    }
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.handleCancel();
    }
  }

  private handleLogicSave(e: CustomEvent) {
    this.currentLogic = e.detail.logic;
  }

  private handleCancel() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-close', {
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  private handleSave() {
    this.dispatchEvent(new CustomEvent('logic-save', {
      detail: { logic: this.currentLogic },
      bubbles: true,
      composed: true
    }));
    this.open = false;
    this.requestUpdate();
  }

  render() {
    if (!this.open) {
      return null;
    }

    return html`
      <div class="modal-backdrop" @click="${this.handleBackdropClick}">
        <div class="modal-container">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Edit Conditional Logic</h2>
              <div class="field-name">For field: ${this.fieldLabel}</div>
            </div>
            <button class="btn-close" @click="${this.handleCancel}" aria-label="Close">
              ×
            </button>
          </div>

          <div class="modal-body">
            <div class="info-message">
              <p>
                <strong>Show this field when:</strong> Add conditions below to control when this field appears.
                Combine conditions with AND (all must be true) or OR (any can be true).
              </p>
            </div>

            <logic-builder
              .availableFields="${this.availableFields}"
              .initialLogic="${this.initialLogic}"
              .hideHeader="${true}"
              .hideFooter="${true}"
              @logic-save="${this.handleLogicSave}"
            ></logic-builder>
          </div>

          <div class="modal-footer">
            <button class="btn btn-cancel" @click="${this.handleCancel}">
              Cancel
            </button>
            <button class="btn btn-save" @click="${this.handleSave}">
              Save Logic
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'logic-modal': LogicModal;
  }
}
