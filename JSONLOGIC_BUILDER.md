# JSONLogic Visual Builder

A visual interface for building conditional logic rules without writing JSON manually.

## Current Implementation

The system currently supports JSONLogic for conditional field and step visibility:

```javascript
// Example: Show email field only when contact method is 'email'
{
  id: 'email-field',
  type: 'email',
  conditionalLogic: {
    '==': [{ var: 'contact_method' }, 'email']
  }
}
```

## Proposed Visual Builder UI

### Concept

A drag-and-drop interface for building logic rules, similar to query builders in database tools.

### Components Needed

#### 1. Logic Builder Component

```typescript
// packages/builder/src/components/logic-builder.ts
@customElement('logic-builder')
export class LogicBuilder extends LitElement {
  @property({ type: Object })
  logic: RulesLogic | null = null;

  @property({ type: Array })
  availableFields: FormField[] = [];

  // Renders a visual tree of conditions
  // Allows adding/removing/editing conditions
  // Converts to/from JSONLogic format
}
```

#### 2. Condition Row Component

```typescript
@customElement('condition-row')
export class ConditionRow extends LitElement {
  @property({ type: String })
  field: string = '';

  @property({ type: String })
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' = '==';

  @property({ type: String })
  value: string = '';
}
```

#### 3. Condition Group Component

```typescript
@customElement('condition-group')
export class ConditionGroup extends LitElement {
  @property({ type: String })
  operator: 'and' | 'or' = 'and';

  @property({ type: Array })
  conditions: LogicNode[] = [];
}
```

### UI Mockup

```
┌────────────────────────────────────────────────┐
│ Conditional Logic Builder                      │
├────────────────────────────────────────────────┤
│                                                │
│  Show this field when:                         │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ ● All (AND) ○ Any (OR)                   │ │
│  │                                           │ │
│  │  [field_name ▼] [equals ▼] [value     ] │ │
│  │                                     [×]  │ │
│  │  [age        ▼] [>=     ▼] [18      ]   │ │
│  │                                     [×]  │ │
│  │                                           │ │
│  │  [+ Add Condition]  [+ Add Group]        │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  [Toggle Advanced Mode]                        │
│                                                │
└────────────────────────────────────────────────┘
```

### Advanced Mode

Allows editing raw JSONLogic for complex scenarios:

```
┌────────────────────────────────────────────────┐
│ Advanced: JSONLogic Editor                     │
├────────────────────────────────────────────────┤
│                                                │
│  {                                             │
│    "and": [                                    │
│      {                                         │
│        "==": [                                 │
│          { "var": "contact_method" },          │
│          "email"                               │
│        ]                                       │
│      },                                        │
│      {                                         │
│        ">=": [                                 │
│          { "var": "age" },                     │
│          18                                    │
│        ]                                       │
│      }                                         │
│    ]                                           │
│  }                                             │
│                                                │
│  [Validate]  [Back to Visual Mode]            │
└────────────────────────────────────────────────┘
```

## Implementation Steps

### 1. Create Logic Builder Components

Create the visual builder components in `packages/builder/src/components/logic/`:

- `logic-builder.ts` - Main logic builder interface
- `condition-row.ts` - Single condition editor
- `condition-group.ts` - Group of conditions with AND/OR
- `logic-preview.ts` - Shows resulting JSONLogic

### 2. Integrate with Field Editor

Modify `field-editor.ts` to include the logic builder:

```typescript
private renderConditionalLogic() {
  return html`
    <div class="form-group">
      <label class="form-label">Conditional Logic</label>
      <logic-builder
        .logic="${this.field?.conditionalLogic}"
        .availableFields="${this.availableFields}"
        @logic-change="${this.handleLogicChange}"
      ></logic-builder>
    </div>
  `;
}
```

### 3. Add to Step Editor

Allow conditional logic for entire steps in multi-step forms.

### 4. Visual Feedback

Show preview of when condition will be true based on current form state.

## Features

### Basic Features

- ✅ Field comparison operators (==, !=, >, <, >=, <=)
- ✅ AND/OR grouping
- ✅ Add/remove conditions
- ✅ Field selector dropdown
- ✅ Operator selector
- ✅ Value input

### Advanced Features

- □ Nested groups (e.g., (A AND B) OR (C AND D))
- □ NOT operator
- □ Complex JSONLogic functions (map, filter, reduce)
- □ Variable references
- □ Custom functions
- □ Import/export logic templates
- □ Logic testing/preview mode

### User Experience

- □ Drag and drop to reorder conditions
- □ Collapse/expand groups
- □ Color coding for different operators
- □ Real-time validation
- □ Error highlighting
- □ Tooltips for operators
- □ Keyboard shortcuts
- □ Undo/redo

## Example Use Cases

### 1. Show field based on selection

```javascript
// Visual: If "contact_method" equals "email"
{
  "==": [{ "var": "contact_method" }, "email"]
}
```

### 2. Age verification

```javascript
// Visual: If "age" is greater than or equal to 18
{
  ">=": [{ "var": "age" }, 18]
}
```

### 3. Complex conditions

```javascript
// Visual: If "country" is "US" AND "age" >= 21
// OR "country" is not "US" AND "age" >= 18
{
  "or": [
    {
      "and": [
        { "==": [{ "var": "country" }, "US"] },
        { ">=": [{ "var": "age" }, 21] }
      ]
    },
    {
      "and": [
        { "!=": [{ "var": "country" }, "US"] },
        { ">=": [{ "var": "age" }, 18] }
      ]
    }
  ]
}
```

### 4. Dependent fields

```javascript
// Visual: Show "other_reason" field if "reason" equals "other"
{
  "==": [{ "var": "reason" }, "other"]
}
```

## Testing

### Unit Tests

Test logic conversion:

```typescript
describe('LogicBuilder', () => {
  it('converts visual conditions to JSONLogic', () => {
    const node: LogicNode = {
      id: '1',
      operator: '==',
      field: 'age',
      value: 18
    };

    const result = nodeToJsonLogic(node);
    expect(result).toEqual({
      '==': [{ var: 'age' }, 18]
    });
  });

  it('converts JSONLogic to visual nodes', () => {
    const logic = {
      '==': [{ var: 'age' }, 18]
    };

    const node = jsonLogicToNode(logic);
    expect(node.operator).toBe('==');
    expect(node.field).toBe('age');
    expect(node.value).toBe(18);
  });
});
```

### Integration Tests

Test in the form builder:

1. Add a condition in visual mode
2. Switch to advanced mode
3. Verify JSONLogic is correct
4. Edit in advanced mode
5. Switch back to visual mode
6. Verify visual representation is correct

## Resources

- [JSONLogic Documentation](http://jsonlogic.com/)
- [JSONLogic Playground](http://jsonlogic.com/play.html)
- [Query Builder Components (inspiration)](https://github.com/ukrbublik/react-awesome-query-builder)

## Future Enhancements

1. **Logic Templates**: Pre-built logic patterns for common scenarios
2. **AI Assistance**: Natural language to JSONLogic conversion
3. **Logic Visualization**: Flow diagram of conditional logic
4. **Testing Mode**: Test conditions with sample data
5. **Version History**: Track changes to conditional logic
6. **Logic Sharing**: Share logic patterns across forms
7. **Performance Analysis**: Show which conditions slow down forms
8. **Accessibility**: Ensure logic builder is keyboard and screen reader accessible
