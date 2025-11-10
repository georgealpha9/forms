"""
Form validation utilities
"""
import re
from typing import Dict, List, Any, Tuple
from json_logic import jsonLogic


class ValidationError:
    """Represents a validation error for a field"""

    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message

    def to_dict(self):
        return {
            'field': self.field,
            'message': self.message
        }


class FormValidator:
    """Validates form data against form definition"""

    def __init__(self, form_definition: Dict[str, Any]):
        self.definition = form_definition

    def validate(self, data: Dict[str, Any]) -> Tuple[bool, List[ValidationError]]:
        """
        Validate form data against the form definition

        Returns:
            Tuple of (is_valid, errors)
        """
        errors = []

        # Validate each step
        for step in self.definition.get('steps', []):
            # Check step visibility based on conditional logic
            if not self._is_step_visible(step, data):
                continue

            # Validate fields in the step
            for field in step.get('fields', []):
                # Check field visibility
                if not self._is_field_visible(field, data):
                    continue

                field_errors = self._validate_field(field, data)
                errors.extend(field_errors)

        return len(errors) == 0, errors

    def _is_step_visible(self, step: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Check if step is visible based on conditional logic"""
        logic = step.get('conditionalLogic')
        if not logic:
            return True

        try:
            return bool(jsonLogic(logic, data))
        except Exception:
            return True

    def _is_field_visible(self, field: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Check if field is visible based on conditional logic"""
        logic = field.get('conditionalLogic')
        if not logic:
            return True

        try:
            return bool(jsonLogic(logic, data))
        except Exception:
            return True

    def _validate_field(self, field: Dict[str, Any], data: Dict[str, Any]) -> List[ValidationError]:
        """Validate a single field"""
        errors = []
        field_name = field.get('name')
        field_type = field.get('type')
        value = data.get(field_name)

        # Get validation rules
        validation_rules = field.get('validation', [])

        for rule in validation_rules:
            rule_type = rule.get('type')
            rule_message = rule.get('message', f'Validation failed for {field_name}')

            if rule_type == 'required':
                if not value or (isinstance(value, str) and not value.strip()):
                    errors.append(ValidationError(field_name, rule_message))

            elif rule_type == 'email':
                if value and not self._is_valid_email(str(value)):
                    errors.append(ValidationError(field_name, rule_message))

            elif rule_type == 'min':
                rule_value = rule.get('value')
                if rule_value is not None:
                    if field_type == 'number':
                        if value is not None and float(value) < float(rule_value):
                            errors.append(ValidationError(field_name, rule_message))
                    elif isinstance(value, str) and len(value) < int(rule_value):
                        errors.append(ValidationError(field_name, rule_message))

            elif rule_type == 'max':
                rule_value = rule.get('value')
                if rule_value is not None:
                    if field_type == 'number':
                        if value is not None and float(value) > float(rule_value):
                            errors.append(ValidationError(field_name, rule_message))
                    elif isinstance(value, str) and len(value) > int(rule_value):
                        errors.append(ValidationError(field_name, rule_message))

            elif rule_type == 'pattern':
                rule_value = rule.get('value')
                if rule_value and value:
                    if not re.match(rule_value, str(value)):
                        errors.append(ValidationError(field_name, rule_message))

        return errors

    @staticmethod
    def _is_valid_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))


def validate_form(form_definition: Dict[str, Any], data: Dict[str, Any]) -> Tuple[bool, List[Dict[str, str]]]:
    """
    Convenience function to validate form data

    Args:
        form_definition: Form definition dictionary
        data: Form data dictionary

    Returns:
        Tuple of (is_valid, errors as list of dicts)
    """
    validator = FormValidator(form_definition)
    is_valid, errors = validator.validate(data)

    return is_valid, [error.to_dict() for error in errors]
