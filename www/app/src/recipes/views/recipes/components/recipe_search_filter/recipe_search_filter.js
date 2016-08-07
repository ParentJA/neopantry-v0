(function (window, angular, undefined) {

  "use strict";

  function RecipeSearchFilterController($scope, SearchType, searchTypeService) {
    $scope.SearchType = SearchType;

    $scope.changeSearchType = function changeSearchType(searchType) {
      searchTypeService.changeSearchType(searchType);
    };
  }

  function recipeSearchFilter() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "recipes/views/recipes/components/recipe_search_filter/recipe_search_filter.html",
      controller: "RecipeSearchFilterController"
    };
  }

  angular.module("app")
    .controller("RecipeSearchFilterController", [
      "$scope", "SearchType", "searchTypeService", RecipeSearchFilterController
    ])
    .directive("recipeSearchFilter", [recipeSearchFilter]);

})(window, window.angular);