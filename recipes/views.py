# Standard library imports...
from itertools import imap, izip

# Third-party imports...
from rest_framework import status, viewsets
from rest_framework.response import Response

# Django imports...
from django.http import Http404

# Local imports...
from .models import Ingredient, Recipe
from .serializers import BasicRecipeSerializer, FoodSerializer, FullRecipeSerializer, IngredientSerializer

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class RecipeAPIViewSet(viewsets.ViewSet):
    def list(self, request):
        ingredients = Ingredient.objects.select_related('recipe', 'food').defer(
            'recipe__description', 'recipe__instructions'
        )

        recipes, foods = izip(*imap(lambda i: (i.recipe, i.food), ingredients))

        return Response(status=status.HTTP_200_OK, data={
            'foods': FoodSerializer(set(foods), many=True).data,
            'ingredients': IngredientSerializer(set(ingredients), many=True).data,
            'recipes': BasicRecipeSerializer(set(recipes), many=True).data
        })

    def retrieve(self, request, pk):
        try:
            recipe = Recipe.objects.only('id', 'description', 'instructions').get(pk=pk)
        except Recipe.DoesNotExist:
            raise Http404

        return Response(status=status.HTTP_200_OK, data=FullRecipeSerializer(recipe).data)
