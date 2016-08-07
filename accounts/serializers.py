# Third-party imports...
from rest_framework import serializers

# Django imports...
from django.contrib.auth import get_user_model

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    password_confirmation = serializers.CharField(write_only=True, required=False)

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 'photo', 'date_of_birth', 'phone_number',
            'password', 'password_confirmation'
        )
