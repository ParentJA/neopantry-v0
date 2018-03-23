# Django imports.
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

__author__ = 'Jason Parent'

admin.autodiscover()

urlpatterns = [
    # Web app...
    # path('app/', TemplateView.as_view(template_name='index.html')),
    path('accounts/', include('accounts.urls')),
    path('api/v1/recipes/', include('recipes.urls')),
    path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),
    path('tinymce/', include('tinymce.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    # Static site.
    # path('', TemplateView.as_view(template_name='site.html')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += path('__debug__/', include(debug_toolbar.urls)),

# Serves static files in development environment...
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serves media files in development environment...
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
