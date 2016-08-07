(function (window, angular, undefined) {

  "use strict";

  function HomeRouterConfig($stateProvider) {
    $stateProvider.state("site.home", {
      url: "/",
      templateUrl: "home/views/home/home.html",
      controller: "HomeController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", HomeRouterConfig]);

})(window, window.angular);