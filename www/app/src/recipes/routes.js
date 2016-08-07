(function (window, angular, undefined) {

  "use strict";

  function RecipesRouterConfig($stateProvider) {
    $stateProvider
      .state("app.recipes", {
        url: "/recipes",
        templateUrl: "recipes/views/recipes/recipes.html",
        controller: "RecipesController"
      })
      .state("app.recipes.list", {
        url: "/list",
        templateUrl: "recipes/views/recipes/components/recipe_list/recipe_list.html",
        controller: "RecipeListController"
      })
      .state("app.recipes.detail", {
        url: "/detail/:recipeId",
        templateUrl: "recipes/views/recipes/components/recipe_detail/recipe_detail.html",
        controller: "RecipeDetailController",
        resolve: {
          recipe: function ($stateParams, loadRecipeService, recipes, recipesModel) {
            var recipeId = $stateParams.recipeId;
            var recipe = _.find(recipes, "id", _.parseInt(recipeId));

            if (!recipesModel.isFullRecipe(recipe)) {
              return loadRecipeService(recipeId);
            }

            return recipe;
          }
        }
      })
      .state("app.recipes.match_list", {
        url: "/match_list",
        templateUrl: "recipes/views/recipes/components/food_match_list/food_match_list.html",
        controller: "FoodMatchListController"
      });
  }

  angular.module("app")
    .config(["$stateProvider", RecipesRouterConfig]);

})(window, window.angular);