# Third-party imports...
from rest_framework import serializers

# Local imports...
from .models import Food, Ingredient, Recipe

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ('id', 'name')


class BasicRecipeSerializer(serializers.ModelSerializer):
    """
    Serializes the basic recipe, while excluding the fields that may have a lot of data. The 'description' and
    'instructions' fields are both text fields. This serializer is used to load groups of recipes.
    """
    class Meta:
        model = Recipe
        exclude = ('description', 'instructions')


class FullRecipeSerializer(serializers.ModelSerializer):
    """
    Serializes the full recipe. This serializer is invoked to load a single recipe, and the data retrieved will
    be added to a previously loaded basic recipe.
    """
    class Meta:
        model = Recipe
        fields = ('id', 'description', 'instructions')


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'description', 'recipe', 'food')
