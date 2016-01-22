# Django imports...
from django.contrib import admin
from django.contrib.auth import get_user_model

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
