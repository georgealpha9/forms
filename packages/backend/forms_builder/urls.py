from django.urls import path
from .views import FormDefinitionView, FormSubmissionView, FormValidationView

app_name = 'forms_builder'

urlpatterns = [
    path('api/forms/<str:form_id>/', FormDefinitionView.as_view(), name='form-definition'),
    path('api/forms/<str:form_id>/submit/', FormSubmissionView.as_view(), name='form-submit'),
    path('api/forms/<str:form_id>/validate/', FormValidationView.as_view(), name='form-validate'),
]
