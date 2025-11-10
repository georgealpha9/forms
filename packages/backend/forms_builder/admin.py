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
    list_display = ('title', 'is_multi_step', 'total_fields', 'submission_count', 'preview_link', 'is_active', 'created_at')
    list_filter = ('is_multi_step', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at', 'total_fields', 'preview_definition', 'form_builder_widget', 'preview_button')
    inlines = [FormValidationRuleInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'description', 'is_multi_step', 'is_active', 'preview_button')
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
            <div id="form-builder-container" style="position: relative; z-index: 1;"></div>
            <script type="module">
                async function initFormBuilder() {{
                    try {{
                        await import('/static/forms_builder/form-builder.js');

                        // Wait for custom element to be defined
                        await customElements.whenDefined('form-builder');

                        const container = document.getElementById('form-builder-container');
                        if (!container) {{
                            console.error('Form builder container not found');
                            return;
                        }}

                        const builder = document.createElement('form-builder');

                        // Load existing definition if available
                        const definitionField = document.querySelector('[name="definition"]');
                        if (definitionField && definitionField.value) {{
                            try {{
                                const def = JSON.parse(definitionField.value);
                                console.log('Loading definition:', def);
                                builder.definition = def;
                            }} catch (e) {{
                                console.error('Error parsing definition:', e);
                            }}
                        }}

                        // Listen for changes and update the hidden field
                        builder.addEventListener('definition-change', (event) => {{
                            console.log('Definition changed:', event.detail.definition);
                            definitionField.value = JSON.stringify(event.detail.definition);
                        }});

                        container.appendChild(builder);
                        console.log('Form builder initialized successfully');
                    }} catch (error) {{
                        console.error('Failed to initialize form builder:', error);
                    }}
                }}

                // Initialize when DOM is ready
                if (document.readyState === 'loading') {{
                    document.addEventListener('DOMContentLoaded', initFormBuilder);
                }} else {{
                    initFormBuilder();
                }}
            </script>
            <style>
                #form-builder-container {{
                    min-height: 600px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin: 10px 0;
                    position: relative;
                }}
                #form-builder-container form-builder {{
                    display: block;
                    position: relative;
                    z-index: 1;
                }}
            </style>
            '''
        )
    form_builder_widget.short_description = 'Form Builder'

    def preview_link(self, obj):
        """Display preview link in list view"""
        url = reverse('forms_builder:form-preview', args=[obj.id])
        return format_html(
            '<a href="{}" target="_blank" style="color: #3b82f6; text-decoration: none;">👁️ Preview</a>',
            url
        )
    preview_link.short_description = 'Preview'

    def preview_button(self, obj):
        """Display large preview button in change form"""
        url = reverse('forms_builder:form-preview', args=[obj.id])
        return format_html(
            '''
            <a href="{}" target="_blank"
               style="display: inline-block; padding: 12px 24px;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                      transition: transform 0.2s;">
                🚀 Preview Form in New Tab
            </a>
            <p style="margin-top: 8px; color: #6b7280; font-size: 14px;">
                Test your form as it will appear to end users
            </p>
            ''',
            url
        )
    preview_button.short_description = 'Form Preview'

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
