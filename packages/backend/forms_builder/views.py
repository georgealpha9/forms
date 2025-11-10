from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, render
from .models import FormDefinition, FormSubmission
from .validation import validate_form
import json


class FormDefinitionView(View):
    """API endpoint to retrieve form definitions"""

    def get(self, request, form_id):
        form = get_object_or_404(FormDefinition, id=form_id, is_active=True)

        return JsonResponse({
            'success': True,
            'form': {
                'id': form.id,
                'title': form.title,
                'description': form.description,
                'isMultiStep': form.is_multi_step,
                'steps': form.definition.get('steps', [])
            }
        })


@method_decorator(csrf_exempt, name='dispatch')
class FormSubmissionView(View):
    """API endpoint to handle form submissions"""

    def post(self, request, form_id):
        try:
            # Get form definition
            form = get_object_or_404(FormDefinition, id=form_id, is_active=True)

            # Parse submission data
            data = json.loads(request.body)

            # Validate form data
            is_valid, errors = validate_form(form.definition, data)

            if not is_valid:
                return JsonResponse({
                    'success': False,
                    'errors': errors
                }, status=400)

            # Create submission
            submission = FormSubmission.objects.create(
                form=form,
                data=data,
                submitted_by=request.user if request.user.is_authenticated else None,
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )

            return JsonResponse({
                'success': True,
                'submission_id': submission.id,
                'message': 'Form submitted successfully'
            })

        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'errors': [{'field': '_form', 'message': 'Invalid JSON data'}]
            }, status=400)

        except Exception as e:
            return JsonResponse({
                'success': False,
                'errors': [{'field': '_form', 'message': str(e)}]
            }, status=500)

    def _get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class FormValidationView(View):
    """API endpoint to validate form data without submitting"""

    def post(self, request, form_id):
        try:
            # Get form definition
            form = get_object_or_404(FormDefinition, id=form_id, is_active=True)

            # Parse data
            data = json.loads(request.body)

            # Validate
            is_valid, errors = validate_form(form.definition, data)

            return JsonResponse({
                'valid': is_valid,
                'errors': errors
            })

        except json.JSONDecodeError:
            return JsonResponse({
                'valid': False,
                'errors': [{'field': '_form', 'message': 'Invalid JSON data'}]
            }, status=400)

        except Exception as e:
            return JsonResponse({
                'valid': False,
                'errors': [{'field': '_form', 'message': str(e)}]
            }, status=500)


def form_preview(request, form_id):
    """Render form preview page"""
    form = get_object_or_404(FormDefinition, id=form_id)
    return render(request, 'forms_builder/form_preview.html', {
        'form': form,
        'form_definition_json': json.dumps(form.definition)
    })
