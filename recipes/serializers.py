# Django imports.
from django.template.defaultfilters import truncatechars_html

# Third-party imports.
from rest_framework import serializers

# Local imports.
from .models import Food, Ingredient, Recipe, RecipeNote, RecipeReview

__author__ = 'Jason Parent'


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ('id', 'name',)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'description', 'rank', 'is_optional',)
        read_only_fields = ('id', 'description', 'rank', 'is_optional',)


class RecipeDetailSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'name', 'description', 'ingredients', 'instructions', 'photo', 'average_make_again',
            'average_rating', 'num_reviews',
        )
        read_only_fields = ('id', 'ingredients', 'average_make_again', 'average_rating', 'num_reviews',)


class RecipeListSerializer(serializers.ModelSerializer):
    short_description = serializers.SerializerMethodField()

    def get_short_description(self, obj):
        return truncatechars_html(obj.description, 255)

    class Meta:
        model = Recipe
        fields = ('id', 'name', 'short_description', 'photo', 'average_make_again', 'average_rating', 'num_reviews',)
        read_only_fields = ('id', 'short_description', 'average_make_again', 'average_rating', 'num_reviews',)


class RecipeNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeNote
        fields = ('id', 'recipe', 'user', 'note', 'created_ts', 'updated_ts',)
        read_only_fields = ('id', 'created_ts', 'updated_ts',)


class RecipeReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = RecipeReview
        fields = ('id', 'recipe', 'user', 'make_again', 'rating', 'review', 'username',)
        read_only_fields = ('id', 'username',)
