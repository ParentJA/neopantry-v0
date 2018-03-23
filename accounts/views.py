# Django imports.
from django.contrib.auth import authenticate, get_user_model, login, logout

# Third-party imports.
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

# Local imports.
from .serializers import UserSerializer

__author__ = 'Jason Parent'

User = get_user_model()


class SignUpView(generics.CreateAPIView):
    lookup_field = 'username'
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LogInView(views.APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user...
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)

                return Response(status=status.HTTP_200_OK, data={
                    'user': UserSerializer(user).data
                })

            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogOutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)

        return Response(status=status.HTTP_204_NO_CONTENT)
