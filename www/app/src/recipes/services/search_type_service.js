(function (window, angular, undefined) {

  function searchTypeService(SearchType) {
    var selectedSearchType = SearchType.RECIPE_NAME;

    this.changeSearchType = function changeSearchType(searchType) {
      selectedSearchType = searchType;
    };

    this.getSearchType = function getSearchType() {
      return selectedSearchType;
    };

    this.isIngredients = function isIngredients() {
      return selectedSearchType === SearchType.INGREDIENTS;
    };

    this.isRecipeName = function isRecipeName() {
      return selectedSearchType === SearchType.RECIPE_NAME;
    };
  }

  angular.module("app")
    .service("searchTypeService", ["SearchType", searchTypeService]);

})(window, window.angular);