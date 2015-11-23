__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf.urls import url

# Local imports...
from .views import RecipeAPIViewSet

urlpatterns = [
    url(r'^(?P<pk>\d+)/$', RecipeAPIViewSet.as_view({'get': 'retrieve'})),
    url(r'^$', RecipeAPIViewSet.as_view({'get': 'list'})),
]
