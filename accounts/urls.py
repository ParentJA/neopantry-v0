# Django imports.
from django.urls import path

# Local imports.
from .views import LogInView, LogOutView, SignUpView

__author__ = 'Jason Parent'


urlpatterns = [
    path('log_in/', LogInView.as_view()),
    path('log_out/', LogOutView.as_view()),
    path('sign_up/', SignUpView.as_view()),
]
