# Third-party imports.
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase

# Local imports.
from ..models import Recipe, RecipeNote
from ..serializers import RecipeNoteSerializer
from ..factories import (
    FoodWithRecipeFactory, IngredientFactory, RecipeFactory, RecipeNoteFactory, RecipeReviewFactory, UserFactory
)

PASSWORD = 'pAssW0rd!'

__author__ = 'Jason Parent'


class RecipeDetailTest(APITestCase):
    def setUp(self):
        self.user = UserFactory(password=PASSWORD)
        self.client = APIClient()
        self.client.login(username=self.user.username, password=PASSWORD)

    def test_user_can_retrieve_recipe(self):
        # Given.
        ingredient = IngredientFactory()
        recipe = ingredient.recipe

        # When.
        response = self.client.get(reverse('recipe-detail', kwargs={'pk': recipe.pk}))

        # Then.
        self.assertEqual(200, response.status_code)
        self.assertEqual(recipe.id, response.data['id'])
        self.assertEqual(recipe.name, response.data['name'])
        self.assertEqual(recipe.description, response.data['description'])
        self.assertEqual(recipe.instructions, response.data['instructions'])
        self.assertIn(member=recipe.photo.url, container=response.data['photo'])
        self.assertEqual(recipe.average_rating, response.data['average_rating'])
        self.assertEqual(recipe.num_reviews, response.data['num_reviews'])
        self.assertEqual(ingredient.description, response.data['ingredients'][0].get('description'))
        self.assertEqual(ingredient.rank, response.data['ingredients'][0].get('rank'))


class RecipeListTest(APITestCase):
    def setUp(self):
        self.user = UserFactory(password=PASSWORD)
        self.client = APIClient()
        self.client.login(username=self.user.username, password=PASSWORD)

    def test_user_can_list_recipes(self):
        # Given.
        # RecipeFactory.create_batch(10)
        FoodWithRecipeFactory.create_batch(10)

        # When.
        response = self.client.get(reverse('recipe-list'))

        # Then.
        self.assertEqual(200, response.status_code)
        # self.assertCountEqual(
        #     RecipeListSerializer(Recipe.objects.all(), many=True).data,
        #     response.data
        # )

    def test_user_can_list_recipes_with_reviews(self):
        # Given.
        recipe = RecipeFactory()
        recipe_reviews = RecipeReviewFactory.create_batch(5, recipe=recipe)

        # When.
        response = self.client.get(reverse('recipe-list'))

        # Then.
        self.assertEqual(200, response.status_code)
        # self.assertCountEqual(
        #     RecipeListSerializer(Recipe.objects.all(), many=True).data,
        #     response.data
        # )
        #
        # def num_reviews(reviews):
        #     return len(reviews)
        #
        # self.assertEqual(num_reviews(recipe_reviews), response.data[0].get('num_reviews'))

    # def test_search_vector_is_added_to_recipe_on_save(self):
    #     # When.
    #     recipe = Recipe(name='Recipe')
    #     recipe.save()
    #
    #     # Then.
    #     self.assertIsNotNone(recipe.search_vector)


class RecipeNoteTest(APITestCase):
    def setUp(self):
        self.user = UserFactory(password=PASSWORD)
        self.client = APIClient()
        self.client.login(username=self.user.username, password=PASSWORD)

    def test_user_can_list_recipe_notes(self):
        # Given.
        recipe = RecipeFactory()
        RecipeNoteFactory(recipe=recipe, user=self.user)

        # When.
        response = self.client.get(reverse('recipe-note-list'), data={'recipe': recipe.pk})

        # Then.
        self.assertEqual(200, response.status_code)
        # self.assertEqual(RecipeNoteSerializer(RecipeNote.objects.all(), many=True).data, response.data)

    def test_user_can_only_list_own_notes(self):
        # Given.
        recipe = RecipeFactory()
        other_user = UserFactory()
        RecipeNoteFactory(recipe=recipe, user=other_user)

        # When.
        response = self.client.get(reverse('recipe-note-list'), data={'recipe': recipe.pk})

        # Then.
        self.assertEqual(200, response.status_code)
        self.assertListEqual([], response.data)

    def test_user_can_create_recipe_note(self):
        # Given.
        recipe = RecipeFactory()

        # When.
        response = self.client.post(reverse('recipe-note-list'), data={
            'note': 'This is a note.',
            'recipe': recipe.pk,
            'user': self.user.pk,
        })

        # Then.
        self.assertEqual(201, response.status_code)
        # self.assertEqual(RecipeNoteSerializer(RecipeNote.objects.last()).data, response.data)

    def test_user_can_retrieve_recipe_note(self):
        # Given.
        recipe = RecipeFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=self.user)

        # When.
        response = self.client.get(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}))

        # Then.
        self.assertEqual(200, response.status_code)
        # self.assertEqual(RecipeNoteSerializer(RecipeNote.objects.get(pk=recipe_note.pk)).data, response.data)

    def test_user_can_only_retrieve_own_note(self):
        # Given.
        recipe = RecipeFactory()
        other_user = UserFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=other_user)

        # When.
        response = self.client.get(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}))

        # Then.
        self.assertEqual(404, response.status_code)

    def test_user_can_update_recipe_note(self):
        # Given.
        recipe = RecipeFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=self.user)

        # When.
        response = self.client.put(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}), data={
            **RecipeNoteSerializer(recipe_note).data,
            'note': 'A new note.',
            'user': self.user.pk,
        })

        # Then.
        self.assertEqual(200, response.status_code)
        # self.assertEqual(RecipeNoteSerializer(RecipeNote.objects.get(pk=recipe_note.pk)).data, response.data)

    def test_user_can_only_update_own_note(self):
        # Given.
        recipe = RecipeFactory()
        other_user = UserFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=other_user)

        # When.
        response = self.client.put(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}), data={
            **RecipeNoteSerializer(recipe_note).data,
            'note': 'A new note.',
            'user': other_user.pk,
        })

        # Then.
        self.assertEqual(403, response.status_code)

    def test_user_can_destroy_recipe_note(self):
        # Given.
        recipe = RecipeFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=self.user)

        # When.
        response = self.client.delete(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}))

        # Then.
        self.assertEqual(204, response.status_code)
        # self.assertIsNone(response.data)
        self.assertFalse(RecipeNote.objects.filter(pk=recipe_note.pk).exists())

    def test_user_can_only_destroy_own_note(self):
        # Given.
        recipe = RecipeFactory()
        other_user = UserFactory()
        recipe_note = RecipeNoteFactory(recipe=recipe, user=other_user)

        # When.
        response = self.client.delete(reverse('recipe-note-detail', kwargs={'pk': recipe_note.pk}))

        # Then.
        self.assertEqual(404, response.status_code)
        self.assertTrue(RecipeNote.objects.filter(pk=recipe_note.pk).exists())


class RecipeReviewTest(APITestCase):
    def setUp(self):
        self.user1 = UserFactory(password=PASSWORD)
        self.user2 = UserFactory(password=PASSWORD)
        self.client = APIClient()
        self.client.login(username=self.user1.username, password=PASSWORD)

    def test_user_can_create_recipe_review(self):
        # Given.
        recipe = RecipeFactory(total_make_again=4, total_ratings=20, num_reviews=4)
        review = RecipeReviewFactory.stub(recipe=recipe, user=self.user1, make_again=True, rating=5)

        # And.
        self.assertEqual(5.0, recipe.average_rating)

        # When.
        response = self.client.post(reverse('recipe-review'), data={
            'recipe': review.recipe.pk,
            'user': review.user.pk,
            'make_again': review.make_again,
            'rating': review.rating,
            'review': review.review,
        })

        # Then.
        self.assertEqual(201, response.status_code)
        self.assertEqual(review.recipe.pk, response.data['recipe'])
        self.assertEqual(review.user.pk, response.data['user'])
        self.assertEqual(review.make_again, response.data['make_again'])
        self.assertEqual(review.rating, response.data['rating'])
        self.assertEqual(review.review, response.data['review'])
        self.assertEqual(review.user.username, response.data['username'])

        # And.
        recipe = Recipe.objects.get(pk=recipe.pk)
        self.assertEqual(100, recipe.average_make_again)
        self.assertEqual(5, recipe.average_rating)
        self.assertEqual(5, recipe.num_reviews)

    def test_user_can_only_create_recipe_review_for_self(self):
        # Given.
        recipe = RecipeFactory()
        review = RecipeReviewFactory.stub(recipe=recipe, user=self.user2)

        # When.
        response = self.client.post(reverse('recipe-review'), data={
            'recipe': review.recipe.pk,
            'user': review.user.pk,
            'make_again': review.make_again,
            'rating': review.rating,
            'review': review.review,
        })

        # Then.
        self.assertEqual(403, response.status_code)

    def test_user_can_only_create_one_review_per_recipe(self):
        # Given.
        recipe = RecipeFactory()
        review = RecipeReviewFactory(recipe=recipe, user=self.user1)

        # When.
        response = self.client.post(reverse('recipe-review'), data={
            'recipe': review.recipe.pk,
            'user': review.user.pk,
            'make_again': review.make_again,
            'rating': review.rating,
            'review': review.review,
        })

        # Then.
        self.assertEqual(400, response.status_code)

    def test_user_can_get_reviews_by_recipe(self):
        # Given.
        recipe1 = RecipeFactory()
        review1 = RecipeReviewFactory(recipe=recipe1, user=self.user1)
        recipe2 = RecipeFactory()
        review2 = RecipeReviewFactory(recipe=recipe2, user=self.user2)

        # When.
        response = self.client.get(reverse('recipe-review'), data={
            'recipe': recipe1.pk
        })

        # Then.
        self.assertEqual(200, response.status_code)
        self.assertCountEqual([recipe1.pk], [review.get('recipe') for review in response.data])

    def test_user_can_get_reviews_by_user(self):
        # Given.
        recipe1 = RecipeFactory()
        review1 = RecipeReviewFactory(recipe=recipe1, user=self.user1)
        recipe2 = RecipeFactory()
        review2 = RecipeReviewFactory(recipe=recipe2, user=self.user2)

        # When.
        response = self.client.get(reverse('recipe-review'), data={
            'user': self.user1.pk
        })

        # Then.
        self.assertEqual(200, response.status_code)
        self.assertCountEqual([self.user1.pk], [review.get('user') for review in response.data])
