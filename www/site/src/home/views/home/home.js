(function (window, angular, undefined) {

  "use strict";

  function HomeController($scope) {}

  angular.module("site")
    .controller("HomeController", ["$scope", HomeController]);

})(window, window.angular);