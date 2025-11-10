import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { FieldType } from '@forms-poc/shared';

interface FieldTypeInfo {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}

const FIELD_TYPES: FieldTypeInfo[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    description: 'Single line text input'
  },
  {
    type: 'email',
    label: 'Email',
    icon: '📧',
    description: 'Email address input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: '🔢',
    description: 'Numeric input'
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: '📄',
    description: 'Multi-line text input'
  }
];

/**
 * Field palette showing available field types
 */
@customElement('field-palette')
export class FieldPalette extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .palette-header {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .field-types {
      display: grid;
      gap: 0.5rem;
    }

    .field-type {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: grab;
      transition: all 0.15s ease-in-out;
    }

    .field-type:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .field-type:active {
      cursor: grabbing;
    }

    .field-type.dragging {
      opacity: 0.5;
    }

    .field-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .field-info {
      flex: 1;
      min-width: 0;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.125rem;
    }

    .field-description {
      font-size: 0.75rem;
      color: #6b7280;
    }
  `;

  private handleDragStart(event: DragEvent, fieldType: FieldType) {
    if (!event.dataTransfer) return;

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify({ fieldType }));

    const target = event.currentTarget as HTMLElement;
    target.classList.add('dragging');

    this.dispatchEvent(new CustomEvent('field-drag-start', {
      detail: { fieldType },
      bubbles: true,
      composed: true
    }));
  }

  private handleDragEnd(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('dragging');
  }

  private handleClick(event: PointerEvent, fieldType: FieldType) {
    const target = event.currentTarget as HTMLElement;
    console.log('Field clicked:', fieldType, target);
    this.dispatchEvent(new CustomEvent('field-click', {
      detail: { fieldType },
      bubbles: true,
      composed: true
    }));

  }

  render() {
    return html`
      <div class="palette-header">Field Types</div>
      <div class="field-types">
        ${FIELD_TYPES.map(fieldInfo => html`
          <div
            class="field-type"
            draggable="true"
            @dragstart="${(e: DragEvent) => this.handleDragStart(e, fieldInfo.type)}"
            @dragend="${this.handleDragEnd}"
            @click="${(e: PointerEvent) => this.handleClick(e, fieldInfo.type)}"
          >
            <div class="field-icon">${fieldInfo.icon}</div>
            <div class="field-info">
              <div class="field-label">${fieldInfo.label}</div>
              <div class="field-description">${fieldInfo.description}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'field-palette': FieldPalette;
  }
}
