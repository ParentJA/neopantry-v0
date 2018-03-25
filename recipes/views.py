# Django imports.
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import F, Prefetch

# Third-party imports.
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, viewsets

# Local imports.
from .models import Ingredient, Recipe, RecipeNote, RecipeReview
from .permissions import IsResourceOwner
from .serializers import (
    RecipeDetailSerializer, RecipeListSerializer, RecipeNoteSerializer, RecipeReviewSerializer
)

__author__ = 'Jason Parent'


class RecipeListView(generics.ListAPIView):
    serializer_class = RecipeListSerializer

    def get_queryset(self):
        query = self.request.query_params.get('query')
        if query is None:
            return Recipe.objects.prefetch_related('foods')
        search_query = SearchQuery(query)
        return Recipe.objects.prefetch_related('foods').annotate(
            rank=SearchRank(F('search_vector'), search_query)
        ).filter(
            rank__gte=0.1
        ).order_by('-rank')


class RecipeDetailView(generics.RetrieveAPIView):
    serializer_class = RecipeDetailSerializer

    def get_queryset(self):
        return Recipe.objects.prefetch_related(
            Prefetch('ingredients', queryset=Ingredient.objects.select_related('food').order_by('rank'))
        )


class RecipeNoteView(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('recipe',)
    permission_classes = (permissions.IsAuthenticated, IsResourceOwner,)
    serializer_class = RecipeNoteSerializer

    def get_queryset(self):
        return RecipeNote.objects.filter(user=self.request.user)


class RecipeReviewView(generics.ListCreateAPIView):
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('recipe', 'user',)
    permission_classes = (permissions.IsAuthenticated, IsResourceOwner,)
    queryset = RecipeReview.objects.select_related('recipe', 'user').all()
    serializer_class = RecipeReviewSerializer

    def perform_create(self, serializer):
        recipe_review = serializer.save()

        # Update recipe.
        recipe = recipe_review.recipe
        recipe.total_make_again += (1 if recipe_review.make_again else 0)
        recipe.total_ratings += recipe_review.rating
        recipe.num_reviews += 1
        recipe.save()
