(function (window, angular, undefined) {

  "use strict";

  function LogInController($scope, $state, $uibModalInstance, accountsService) {
    $scope.error = {};
    $scope.form = "";
    $scope.password = "";
    $scope.username = "";

    $scope.close = function close() {
      $uibModalInstance.close();
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.logIn($scope.username, $scope.password).then(function () {
        //$state.go("site.home");
      }, function (response) {
        $scope.error = response.data;
        $scope.password = "";
      });
    };
  }

  angular.module("site")
    .controller("LogInController", ["$scope", "$state", "$uibModalInstance", "accountsService", LogInController]);

})(window, window.angular);