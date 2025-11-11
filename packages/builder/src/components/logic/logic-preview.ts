import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RulesLogic } from 'json-logic-js';

/**
 * Preview panel showing the generated JSONLogic
 */
@customElement('logic-preview')
export class LogicPreview extends LitElement {
  @property({ attribute: false }) logic: RulesLogic | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .preview-container {
      background: #1f2937;
      border-radius: 0.375rem;
      padding: 1rem;
      overflow: hidden;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .preview-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-copy {
      padding: 0.375rem 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }

    .btn-copy:hover {
      background: #2563eb;
    }

    .btn-copy.copied {
      background: #10b981;
    }

    pre {
      margin: 0;
      padding: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #e5e7eb;
      overflow-x: auto;
    }

    .json-key {
      color: #93c5fd;
    }

    .json-string {
      color: #86efac;
    }

    .json-number {
      color: #fbbf24;
    }

    .json-boolean {
      color: #c084fc;
    }

    .json-null {
      color: #f87171;
    }

    .empty-preview {
      color: #6b7280;
      font-style: italic;
      text-align: center;
      padding: 2rem 1rem;
    }
  `;

  private copyButtonText = 'Copy';

  private syntaxHighlight(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  private async handleCopy() {
    if (!this.logic) return;

    try {
      const jsonString = JSON.stringify(this.logic, null, 2);
      await navigator.clipboard.writeText(jsonString);

      this.copyButtonText = 'Copied!';
      this.requestUpdate();

      setTimeout(() => {
        this.copyButtonText = 'Copy';
        this.requestUpdate();
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  render() {
    if (!this.logic || Object.keys(this.logic).length === 0) {
      return html`
        <div class="preview-container">
          <div class="preview-header">
            <div class="preview-title">JSONLogic Preview</div>
          </div>
          <div class="empty-preview">
            Add conditions to see the JSONLogic output
          </div>
        </div>
      `;
    }

    const jsonString = JSON.stringify(this.logic, null, 2);
    const highlighted = this.syntaxHighlight(jsonString);

    return html`
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-title">JSONLogic Preview</div>
          <button
            class="btn-copy ${this.copyButtonText === 'Copied!' ? 'copied' : ''}"
            @click="${this.handleCopy}"
          >
            ${this.copyButtonText}
          </button>
        </div>
        <pre><code>${html([highlighted] as any)}</code></pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'logic-preview': LogicPreview;
  }
}
