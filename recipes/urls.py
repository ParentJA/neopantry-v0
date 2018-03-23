# Django imports.
from django.urls import path

# Local imports.
from .views import RecipeDetailView, RecipeListView, RecipeNoteView, RecipeReviewView

__author__ = 'Jason Parent'

urlpatterns = [
    path('notes/<int:pk>/', RecipeNoteView.as_view({
        'get': 'retrieve',
        'put': 'partial_update',
        'delete': 'destroy',
    }), name='recipe-note-detail'),
    path('notes/', RecipeNoteView.as_view({
        'get': 'list',
        'post': 'create',
    }), name='recipe-note-list'),
    path('reviews/', RecipeReviewView.as_view(), name='recipe-review'),
    path('<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('', RecipeListView.as_view(), name='recipe-list'),
]
