# Django imports...
from django.conf.urls import url

# Local imports...
from .views import LogInView, LogOutView, SignUpView

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


urlpatterns = [
    url(r'^log_in/$', LogInView.as_view()),
    url(r'^log_out/$', LogOutView.as_view()),
    url(r'^sign_up/$', SignUpView.as_view()),
]
