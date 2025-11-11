import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FormField, LogicNode } from '@forms-poc/shared';
import './condition-row';

/**
 * Group of conditions with AND/OR logic
 */
@customElement('condition-group')
export class ConditionGroup extends LitElement {
  @property({ attribute: false }) node!: LogicNode;
  @property({ attribute: false }) availableFields: FormField[] = [];
  @property({ type: Number }) depth: number = 0;

  static styles = css`
    :host {
      display: block;
    }

    .group-container {
      border-left: 3px solid #3b82f6;
      padding-left: 1rem;
      margin-bottom: 0.75rem;
    }

    .group-container.depth-0 {
      border-left: none;
      padding-left: 0;
    }

    .group-container.depth-1 {
      border-left-color: #10b981;
    }

    .group-container.depth-2 {
      border-left-color: #f59e0b;
    }

    .group-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .operator-toggle {
      display: flex;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .operator-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: white;
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .operator-btn.active {
      background: #3b82f6;
      color: white;
    }

    .operator-btn:hover:not(.active) {
      background: #f3f4f6;
    }

    .btn-add {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-add:hover {
      background: #2563eb;
    }

    .btn-add-group {
      padding: 0.5rem 1rem;
      background: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-add-group:hover {
      background: #eff6ff;
    }

    .btn-remove-group {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-left: auto;
    }

    .btn-remove-group:hover {
      background: #dc2626;
    }

    .conditions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .empty-group {
      padding: 1rem;
      text-align: center;
      color: #9ca3af;
      font-size: 0.875rem;
      background: #f9fafb;
      border: 1px dashed #d1d5db;
      border-radius: 0.375rem;
    }
  `;

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleOperatorToggle(operator: 'and' | 'or') {
    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, operator },
      bubbles: true,
      composed: true
    }));
  }

  private handleAddCondition() {
    const newCondition: LogicNode = {
      id: this.generateId(),
      operator: '==',
      field: '',
      value: ''
    };

    const updatedChildren = [...(this.node.children || []), newCondition];

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private handleAddGroup() {
    const newGroup: LogicNode = {
      id: this.generateId(),
      operator: 'and',
      children: []
    };

    const updatedChildren = [...(this.node.children || []), newGroup];

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private handleRemoveGroup() {
    this.dispatchEvent(new CustomEvent('group-remove', {
      detail: { id: this.node.id },
      bubbles: true,
      composed: true
    }));
  }

  private handleConditionChange(e: CustomEvent) {
    const updatedCondition = e.detail;
    const updatedChildren = (this.node.children || []).map(child =>
      child.id === updatedCondition.id ? updatedCondition : child
    );

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private handleConditionRemove(e: CustomEvent) {
    const { id } = e.detail;
    const updatedChildren = (this.node.children || []).filter(child => child.id !== id);

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private handleNestedGroupChange(e: CustomEvent) {
    const updatedGroup = e.detail;
    const updatedChildren = (this.node.children || []).map(child =>
      child.id === updatedGroup.id ? updatedGroup : child
    );

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private handleNestedGroupRemove(e: CustomEvent) {
    const { id } = e.detail;
    const updatedChildren = (this.node.children || []).filter(child => child.id !== id);

    this.dispatchEvent(new CustomEvent('group-change', {
      detail: { ...this.node, children: updatedChildren },
      bubbles: true,
      composed: true
    }));
  }

  private isGroup(node: LogicNode): boolean {
    return node.operator === 'and' || node.operator === 'or';
  }

  render() {
    const children = this.node.children || [];
    const showRemoveButton = this.depth > 0;

    return html`
      <div class="group-container depth-${this.depth}">
        <div class="group-header">
          ${this.depth > 0 ? html`<span style="color: #6b7280; font-size: 0.875rem;">Match</span>` : ''}

          <div class="operator-toggle">
            <button
              class="operator-btn ${this.node.operator === 'and' ? 'active' : ''}"
              @click="${() => this.handleOperatorToggle('and')}"
            >
              AND
            </button>
            <button
              class="operator-btn ${this.node.operator === 'or' ? 'active' : ''}"
              @click="${() => this.handleOperatorToggle('or')}"
            >
              OR
            </button>
          </div>

          <button class="btn-add" @click="${this.handleAddCondition}">
            + Add Condition
          </button>

          ${this.depth < 2 ? html`
            <button class="btn-add-group" @click="${this.handleAddGroup}">
              + Add Group
            </button>
          ` : ''}

          ${showRemoveButton ? html`
            <button class="btn-remove-group" @click="${this.handleRemoveGroup}">
              Remove Group
            </button>
          ` : ''}
        </div>

        ${children.length === 0 ? html`
          <div class="empty-group">
            No conditions yet. Click "Add Condition" to get started.
          </div>
        ` : html`
          <div class="conditions-list">
            ${children.map(child => {
              if (this.isGroup(child)) {
                return html`
                  <condition-group
                    .node="${child}"
                    .availableFields="${this.availableFields}"
                    .depth="${this.depth + 1}"
                    @group-change="${this.handleNestedGroupChange}"
                    @group-remove="${this.handleNestedGroupRemove}"
                    @condition-change="${this.handleConditionChange}"
                    @condition-remove="${this.handleConditionRemove}"
                  ></condition-group>
                `;
              } else {
                return html`
                  <condition-row
                    .node="${child}"
                    .availableFields="${this.availableFields}"
                    @condition-change="${this.handleConditionChange}"
                    @condition-remove="${this.handleConditionRemove}"
                  ></condition-row>
                `;
              }
            })}
          </div>
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'condition-group': ConditionGroup;
  }
}
