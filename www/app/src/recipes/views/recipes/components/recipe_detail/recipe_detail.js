(function (window, angular, undefined) {

  "use strict";

  function RecipeDetailController($scope, recipe, recipes) {
    $scope.recipe = recipe;
    $scope.recipeIngredients = [];
    $scope.totalFoods = 0;

    activate();

    function activate() {
      $scope.recipeIngredients = _.map(recipe.ingredients, "description");
      $scope.totalFoods = _.size(recipe.foods);
    }
  }

  function recipeDetail() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "/static/recipes/views/recipes/components/recipe_detail/recipe_detail.html",
      controller: "RecipeDetailController"
    };
  }

  angular.module("app")
    .controller("RecipeDetailController", ["$scope", "recipe", "recipes", RecipeDetailController])
    .directive("recipeDetail", [recipeDetail]);

})(window, window.angular);