(function (window, angular, undefined) {

  "use strict";

  function RecipeController($scope) {}

  function recipe() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "/static/recipes/views/recipes/components/recipe/recipe.html",
      controller: "RecipeController"
    };
  }

  angular.module("app")
    .directive("recipe", ["$scope", recipe]);

})(window, window.angular);