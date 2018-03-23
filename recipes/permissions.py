# Third-party imports.
from rest_framework import permissions

__author__ = 'Jason Parent'


class IsResourceOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.data.get('user')
        if user is not None:
            return int(user) == request.user.pk
        return True

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user
