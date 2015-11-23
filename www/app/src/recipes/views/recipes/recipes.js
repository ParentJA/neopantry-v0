(function (window, angular, undefined) {

  "use strict";

  function RecipesController($scope, $state, recipes, SearchType, searchTypeService) {
    $scope.hasRecipes = false;
    $scope.matchingRecipes = [];
    $scope.recipes = [];
    $scope.SearchType = SearchType;
    $scope.totalRecipes = 0;

    $scope.addSelectedFood = function addSelectedFood(food) {
      recipes.addSelectedFood(food);
    };

    $scope.changeSearchType = function changeSearchType(searchType) {
      searchTypeService.changeSearchType(searchType);
    };

    $scope.getFoods = function getFoods() {
      return recipes.getFoods();
    };

    $scope.getSelectedFoods = function getSelectedFoods() {
      return recipes.getSelectedFoods();
    };

    $scope.isIngredients = function isIngredients() {
      return searchTypeService.isIngredients();
    };

    $scope.isRecipeName = function isRecipeName() {
      return searchTypeService.isRecipeName();
    };

    $scope.isSelectedRecipe = function isSelectedRecipe(value) {
      return recipes.isSelectedRecipe(value);
    };

    /*$scope.onKeyPressed = function onKeyPressed(event) {
      if (event.keyCode === 13) {
        $state.go("app.recipes.detail", {
          recipeId: $scope.recipe.id
        });

        // Clear recipe...
        $scope.recipe = null;
      }
    };*/

    $scope.removeSelectedFood = function removeSelectedFood(food) {
      recipes.removeSelectedFood(food);
    };

    $scope.setSelectedRecipe = function setSelectedRecipe(value) {
      recipes.setSelectedRecipe(value);
    };

    $scope.$watchCollection(recipes.getSelectedFoods, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.hasRecipes = recipes.hasRecipes();
        $scope.matchingRecipes = getMatchingRecipes();
        $scope.recipes = recipes.getRecipes();
        $scope.totalRecipes = _.size($scope.recipes);
      }
    });

    activate();

    function activate() {
      $scope.hasRecipes = recipes.hasRecipes();
      $scope.matchingRecipes = getMatchingRecipes();
      $scope.recipes = recipes.getRecipes();
      $scope.totalRecipes = _.size($scope.recipes);
    }

    function getMatchingRecipes() {
      return recipes.searchByFoods(recipes.getSelectedFoods());
    }
  }

  angular.module("app")
    .controller("RecipesController", ["$scope", "$state", "recipes", "SearchType", "searchTypeService", RecipesController]);

})(window, window.angular);