"""
URL configuration for demo_project.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('forms/', include('forms_builder.urls')),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('builder/', TemplateView.as_view(template_name='forms/builder.html'), name='builder'),
    path('renderer/<str:form_id>/', TemplateView.as_view(template_name='forms/renderer.html'), name='renderer'),
]
