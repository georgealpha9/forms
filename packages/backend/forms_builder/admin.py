from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import FormDefinition, FormSubmission, FormValidationRule
import json


class FormValidationRuleInline(admin.TabularInline):
    model = FormValidationRule
    extra = 0
    fields = ('field_name', 'rule_type', 'rule_value', 'error_message', 'order')


@admin.register(FormDefinition)
class FormDefinitionAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_multi_step', 'total_fields', 'submission_count', 'is_active', 'created_at')
    list_filter = ('is_multi_step', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at', 'total_fields', 'preview_definition')
    inlines = [FormValidationRuleInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'description', 'is_multi_step', 'is_active')
        }),
        ('Form Builder', {
            'fields': ('form_builder_widget',),
            'description': 'Use the visual form builder to create your form'
        }),
        ('Form Definition (JSON)', {
            'fields': ('definition', 'preview_definition'),
            'classes': ('collapse',),
            'description': 'Advanced: View or edit the raw JSON definition'
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at', 'total_fields'),
            'classes': ('collapse',)
        }),
    )

    def submission_count(self, obj):
        count = obj.submissions.count()
        url = reverse('admin:forms_builder_formsubmission_changelist') + f'?form__id__exact={obj.id}'
        return format_html('<a href="{}">{} submissions</a>', url, count)
    submission_count.short_description = 'Submissions'

    def preview_definition(self, obj):
        """Display formatted JSON definition"""
        if obj.definition:
            formatted_json = json.dumps(obj.definition, indent=2)
            return format_html(
                '<pre style="background-color: #f5f5f5; padding: 10px; '
                'border-radius: 5px; max-height: 400px; overflow: auto;">{}</pre>',
                formatted_json
            )
        return '-'
    preview_definition.short_description = 'Definition Preview'

    def form_builder_widget(self, obj):
        """Render the form builder interface"""
        return format_html(
            '''
            <div id="form-builder-container"></div>
            <script type="module">
                import '/static/forms_builder/form-builder.js';

                const container = document.getElementById('form-builder-container');
                const builder = document.createElement('form-builder');

                // Load existing definition if available
                const definitionField = document.querySelector('[name="definition"]');
                if (definitionField && definitionField.value) {{
                    try {{
                        builder.definition = JSON.parse(definitionField.value);
                    }} catch (e) {{
                        console.error('Error parsing definition:', e);
                    }}
                }}

                // Listen for changes and update the hidden field
                builder.addEventListener('definition-change', (event) => {{
                    definitionField.value = JSON.stringify(event.detail.definition);
                }});

                container.appendChild(builder);
            </script>
            <style>
                #form-builder-container {{
                    min-height: 600px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin: 10px 0;
                }}
            </style>
            '''
        )
    form_builder_widget.short_description = 'Form Builder'

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_display = ('form', 'submitted_by', 'submitted_at', 'ip_address')
    list_filter = ('form', 'submitted_at')
    search_fields = ('form__title', 'submitted_by__username', 'data')
    readonly_fields = ('form', 'data', 'submitted_by', 'submitted_at', 'ip_address', 'user_agent', 'formatted_data')
    date_hierarchy = 'submitted_at'

    fieldsets = (
        ('Submission Information', {
            'fields': ('form', 'submitted_by', 'submitted_at')
        }),
        ('Submitted Data', {
            'fields': ('formatted_data', 'data'),
        }),
        ('Technical Details', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
    )

    def formatted_data(self, obj):
        """Display formatted submission data"""
        if obj.data:
            html = '<table style="width: 100%; border-collapse: collapse;">'
            for key, value in obj.data.items():
                html += f'''
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; font-weight: bold; width: 30%;">{key}</td>
                    <td style="padding: 8px;">{value}</td>
                </tr>
                '''
            html += '</table>'
            return mark_safe(html)
        return '-'
    formatted_data.short_description = 'Submission Data'

    def has_add_permission(self, request):
        # Submissions should only be created through the frontend
        return False

    def has_change_permission(self, request, obj=None):
        # Submissions should be read-only in admin
        return False


@admin.register(FormValidationRule)
class FormValidationRuleAdmin(admin.ModelAdmin):
    list_display = ('form', 'field_name', 'rule_type', 'order')
    list_filter = ('rule_type', 'form')
    search_fields = ('field_name', 'error_message')
    list_editable = ('order',)
