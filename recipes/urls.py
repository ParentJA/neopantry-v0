# Django imports...
from django.conf.urls import url

# Local imports...
from .views import RecipeAPIViewSet

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

urlpatterns = [
    url(r'^(?P<pk>\d+)/$', RecipeAPIViewSet.as_view({'get': 'retrieve'})),
    url(r'^$', RecipeAPIViewSet.as_view({'get': 'list'})),
]
