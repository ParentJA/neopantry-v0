(function (window, angular, undefined) {

  "use strict";

  function SignUpController($scope, $state, $uibModalInstance, accountsService) {
    $scope.email = "";
    $scope.error = {};
    $scope.firstName = "";
    $scope.form = "";
    $scope.lastName = "";
    $scope.password1 = "";
    $scope.password2 = "";

    $scope.close = function close() {
      $uibModalInstance.close();
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.signUp($scope.firstName, $scope.lastName, $scope.email, $scope.password1).then(function () {
        $state.go("app.recipes.list");
      }, function (response) {
        $scope.error = response.data;
        $scope.email = "";
        $scope.password1 = "";
        $scope.password2 = "";
      });
    };
  }

  angular.module("app")
    .controller("SignUpController", ["$scope", "$state", "$uibModalInstance", "accountsService", SignUpController]);

})(window, window.angular);