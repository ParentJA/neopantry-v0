(function (window, angular, undefined) {

  "use strict";

  function HomeController($scope) {}

  angular.module("app")
    .controller("HomeController", ["$scope", HomeController]);

})(window, window.angular);