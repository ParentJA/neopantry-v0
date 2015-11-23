(function (window, angular, undefined) {

  "use strict";

  function FoodMatchListController($scope, recipesModel) {
    $scope.hasSelectedFoods = false;

    $scope.$watch(recipesModel.hasSelectedFoods, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.hasSelectedFoods = newValue;
      }
    });

    activate();

    function activate() {
      $scope.hasSelectedFoods = recipesModel.hasSelectedFoods();
    }
  }

  angular.module("app")
    .controller("FoodMatchListController", ["$scope", "recipesModel", FoodMatchListController]);

})(window, window.angular);