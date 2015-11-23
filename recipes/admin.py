__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.contrib import admin

# Local imports...
from .models import (
    Food, Recipe
)


class IngredientAdmin(admin.TabularInline):
    model = Recipe.foods.through
    extra = 1

    # Handle fields...
    fields = ('description', 'food')
    raw_id_fields = 'food',
    autocomplete_lookup_fields = {
        'fk': ('food', 'unit_of_measure')
    }


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    change_form_template = 'recipes/admin/change_form.html'
    fields = ('name', 'description', 'instructions')
    inlines = IngredientAdmin,


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    fields = 'name',
