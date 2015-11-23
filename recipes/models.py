__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.db import models


class Recipe(models.Model):
    """A preparation of foods."""
    name = models.CharField(max_length=255)
    description = models.TextField()
    instructions = models.TextField()
    foods = models.ManyToManyField('recipes.Food', through='recipes.Ingredient', through_fields=('recipe', 'food'))

    class Meta:
        default_related_name = 'recipes'
        ordering = 'name',

    def __unicode__(self):
        return self.name


class Ingredient(models.Model):
    """A food that is prepared and used in a recipe in measured amounts."""
    description = models.CharField(max_length=255)
    recipe = models.ForeignKey('recipes.Recipe', related_name='ingredients')
    food = models.ForeignKey('recipes.Food', related_name='ingredients')

    class Meta:
        default_related_name = 'ingredients'

    def __unicode__(self):
        return self.description


class Food(models.Model):
    """An edible item."""
    name = models.CharField(max_length=255)

    @staticmethod
    def autocomplete_search_fields():
        return 'name__icontains',

    class Meta:
        default_related_name = 'foods'
        ordering = 'name',

    def __unicode__(self):
        return self.name
