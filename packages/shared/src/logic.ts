import jsonLogic from 'json-logic-js';
import type { RulesLogic } from 'json-logic-js';
import type { FormData, LogicNode } from './types';

/**
 * Evaluates JSONLogic rules against form data
 */
export function evaluateLogic(logic: RulesLogic, data: FormData): boolean {
  try {
    return jsonLogic.apply(logic, data) as boolean;
  } catch (error) {
    console.error('Error evaluating logic:', error);
    return false;
  }
}

/**
 * Converts a LogicNode tree to JSONLogic format
 */
export function nodeToJsonLogic(node: LogicNode): RulesLogic {
  if (node.operator === 'and' || node.operator === 'or') {
    const children = node.children?.map(nodeToJsonLogic) || [];
    return { [node.operator]: children };
  }

  if (node.operator === 'not') {
    const child = node.children?.[0];
    return { '!': child ? nodeToJsonLogic(child) : null };
  }

  // Comparison operators
  if (node.field && node.value !== undefined) {
    return {
      [node.operator]: [
        { var: node.field },
        node.value
      ]
    };
  }

  return {};
}

/**
 * Converts JSONLogic to a LogicNode tree (simplified version)
 */
export function jsonLogicToNode(logic: RulesLogic, id: string = '0'): LogicNode | null {
  if (typeof logic !== 'object' || logic === null) {
    return null;
  }

  const [operator, value] = Object.entries(logic)[0];

  if (operator === 'and' || operator === 'or') {
    return {
      id,
      operator: operator as 'and' | 'or',
      children: (value as RulesLogic[]).map((child, i) =>
        jsonLogicToNode(child, `${id}-${i}`)
      ).filter((n): n is LogicNode => n !== null)
    };
  }

  if (operator === '!') {
    const child = jsonLogicToNode(value as RulesLogic, `${id}-0`);
    return child ? {
      id,
      operator: 'not',
      children: [child]
    } : null;
  }

  // Comparison operators
  const comparisonOps = ['==', '!=', '>', '<', '>=', '<='];
  if (comparisonOps.includes(operator) && Array.isArray(value) && value.length === 2) {
    const [left, right] = value;
    if (typeof left === 'object' && left !== null && 'var' in left) {
      return {
        id,
        operator: operator as '==' | '!=' | '>' | '<' | '>=' | '<=',
        field: left.var as string,
        value: right
      };
    }
  }

  return null;
}

/**
 * Creates a simple equality check
 */
export function createSimpleCondition(field: string, value: any): RulesLogic {
  return {
    '==': [{ var: field }, value]
  };
}

/**
 * Combines multiple conditions with AND
 */
export function andConditions(...conditions: RulesLogic[]): RulesLogic {
  return { and: conditions };
}

/**
 * Combines multiple conditions with OR
 */
export function orConditions(...conditions: RulesLogic[]): RulesLogic {
  return { or: conditions };
}
