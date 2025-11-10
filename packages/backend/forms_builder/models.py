from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
import json

User = get_user_model()


class FormDefinition(models.Model):
    """
    Model to store form definitions created in the form builder
    """
    id = models.CharField(max_length=255, primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_multi_step = models.BooleanField(default=False)
    definition = models.JSONField(
        help_text=_("Complete form definition in JSON format")
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_forms'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Form Definition")
        verbose_name_plural = _("Form Definitions")
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def steps(self):
        """Get form steps from definition"""
        return self.definition.get('steps', [])

    @property
    def total_fields(self):
        """Count total fields across all steps"""
        return sum(len(step.get('fields', [])) for step in self.steps)


class FormSubmission(models.Model):
    """
    Model to store form submissions
    """
    form = models.ForeignKey(
        FormDefinition,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    data = models.JSONField(
        help_text=_("Submitted form data")
    )
    submitted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='form_submissions'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        verbose_name = _("Form Submission")
        verbose_name_plural = _("Form Submissions")
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.form.title} - {self.submitted_at.strftime('%Y-%m-%d %H:%M')}"

    def get_field_value(self, field_name):
        """Get value for a specific field"""
        return self.data.get(field_name)


class FormValidationRule(models.Model):
    """
    Model to store custom validation rules
    """
    RULE_TYPES = [
        ('required', _('Required')),
        ('email', _('Email')),
        ('min', _('Minimum')),
        ('max', _('Maximum')),
        ('pattern', _('Pattern')),
        ('custom', _('Custom')),
    ]

    form = models.ForeignKey(
        FormDefinition,
        on_delete=models.CASCADE,
        related_name='validation_rules'
    )
    field_name = models.CharField(max_length=255)
    rule_type = models.CharField(max_length=50, choices=RULE_TYPES)
    rule_value = models.CharField(max_length=255, blank=True)
    error_message = models.CharField(max_length=255)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = _("Validation Rule")
        verbose_name_plural = _("Validation Rules")
        ordering = ['order']

    def __str__(self):
        return f"{self.field_name} - {self.rule_type}"
