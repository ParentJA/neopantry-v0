(function (window, angular, undefined) {

  "use strict";

  function RecipeListController($scope) {}

  function recipeList() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "/static/recipes/views/recipes/components/recipe_list/recipe_list.html",
      controller: "RecipeListController"
    };
  }

  angular.module("app")
    .controller("RecipeListController", ["$scope", RecipeListController])
    .directive("recipeList", [recipeList]);

})(window, window.angular);