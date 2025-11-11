import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FormField, LogicNode } from '@forms-poc/shared';
import { nodeToJsonLogic, jsonLogicToNode } from '@forms-poc/shared';
import type { RulesLogic } from 'json-logic-js';
import './condition-group';
import './logic-preview';

/**
 * Main logic builder component
 */
@customElement('logic-builder')
export class LogicBuilder extends LitElement {
  @property({ attribute: false }) availableFields: FormField[] = [];
  @property({ attribute: false }) initialLogic: RulesLogic | null = null;
  @property({ type: Boolean }) embedded = false; // True when used in modal
  @property({ type: Boolean }) hideHeader = false; // Hide collapsible header
  @property({ type: Boolean }) hideFooter = false; // Hide save/clear buttons

  @state() private _rootNode: LogicNode;
  @state() private _isExpanded: boolean;

  constructor() {
    super();
    this._rootNode = {
      id: 'root',
      operator: 'and',
      children: []
    };
    this._isExpanded = true;
  }

  private get rootNode(): LogicNode {
    return this._rootNode;
  }

  private set rootNode(value: LogicNode) {
    this._rootNode = value;
  }

  private get isExpanded(): boolean {
    return this._isExpanded;
  }

  private set isExpanded(value: boolean) {
    this._isExpanded = value;
  }

  static styles = css`
    :host {
      display: block;
    }

    .logic-builder-container {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      cursor: pointer;
      user-select: none;
    }

    .builder-header:hover {
      background: #f3f4f6;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .header-badge {
      padding: 0.25rem 0.5rem;
      background: #3b82f6;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 0.25rem;
    }

    .header-badge.empty {
      background: #9ca3af;
    }

    .expand-icon {
      color: #6b7280;
      transition: transform 0.2s;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .builder-content {
      padding: 1rem;
      background: #fafafa;
    }

    .builder-footer {
      padding: 1rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-clear {
      background: white;
      color: #ef4444;
      border: 1px solid #ef4444;
    }

    .btn-clear:hover {
      background: #fef2f2;
    }

    .btn-save {
      background: #3b82f6;
      color: white;
    }

    .btn-save:hover {
      background: #2563eb;
    }

    .preview-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .hidden {
      display: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    console.log('LogicBuilder connected, availableFields:', this.availableFields.length, 'initialLogic:', this.initialLogic);
    this.initializeFromLogic();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('initialLogic')) {
      this.initializeFromLogic();
    }
  }

  private initializeFromLogic() {
    console.log('Initializing logic from:', this.initialLogic);
    if (this.initialLogic && Object.keys(this.initialLogic).length > 0) {
      const node = jsonLogicToNode(this.initialLogic);
      console.log('Converted to node:', node);
      if (node) {
        this.rootNode = node;
        this.isExpanded = true;
      }
    }
  }

  private handleToggle() {
    this.isExpanded = !this.isExpanded;
  }

  private handleGroupChange(e: CustomEvent) {
    this.rootNode = e.detail;
    this.requestUpdate();
  }

  private handleClear() {
    this.rootNode = {
      id: 'root',
      operator: 'and',
      children: []
    };
    this.dispatchEvent(new CustomEvent('logic-clear', {
      bubbles: true,
      composed: true
    }));
  }

  private handleSave() {
    const logic = this.rootNode.children && this.rootNode.children.length > 0
      ? nodeToJsonLogic(this.rootNode)
      : null;

    this.dispatchEvent(new CustomEvent('logic-save', {
      detail: { logic },
      bubbles: true,
      composed: true
    }));
  }

  private getConditionCount(): number {
    const countConditions = (node: LogicNode): number => {
      if (node.operator === 'and' || node.operator === 'or') {
        return (node.children || []).reduce((sum, child) => sum + countConditions(child), 0);
      }
      return 1;
    };

    return (this.rootNode.children || []).reduce((sum, child) => sum + countConditions(child), 0);
  }

  render() {
    const conditionCount = this.getConditionCount();
    const hasConditions = conditionCount > 0;
    const currentLogic = hasConditions ? nodeToJsonLogic(this.rootNode) : null;
    const showContent = this.hideHeader || this.isExpanded;

    return html`
      <div class="logic-builder-container">
        ${!this.hideHeader ? html`
          <div class="builder-header" @click="${this.handleToggle}">
            <div class="header-content">
              <span class="expand-icon ${this.isExpanded ? 'expanded' : ''}">▶</span>
              <span class="header-title">Conditional Logic</span>
              <span class="header-badge ${hasConditions ? '' : 'empty'}">
                ${conditionCount} condition${conditionCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ` : ''}

        <div class="${showContent ? '' : 'hidden'}">
          <div class="builder-content">
            <condition-group
              .node="${this.rootNode}"
              .availableFields="${this.availableFields}"
              .depth="${0}"
              @group-change="${this.handleGroupChange}"
            ></condition-group>

            ${hasConditions ? html`
              <div class="preview-section">
                <logic-preview .logic="${currentLogic}"></logic-preview>
              </div>
            ` : ''}
          </div>

          ${!this.hideFooter ? html`
            <div class="builder-footer">
              ${hasConditions ? html`
                <button class="btn btn-clear" @click="${this.handleClear}">
                  Clear All
                </button>
              ` : ''}
              <button class="btn btn-save" @click="${this.handleSave}">
                Save Logic
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'logic-builder': LogicBuilder;
  }
}
