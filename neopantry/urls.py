# Django imports...
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

admin.autodiscover()

urlpatterns = [
    # Static site...
    url(r'^$', TemplateView.as_view(template_name='site.html')),
    # Web app...
    url(r'^app/$', TemplateView.as_view(template_name='app.html')),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^api/v1/recipes/', include('recipes.urls')),
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^tinymce/', include('tinymce.urls')),
]

# Serves static files in development environment...
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serves media files in development environment...
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
