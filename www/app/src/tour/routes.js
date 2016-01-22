(function (window, angular, undefined) {

  "use strict";

  function TourRouterConfig($stateProvider) {
    $stateProvider.state("tour", {
      url: "/tour",
      templateUrl: "/static/tour/views/tour/tour.html",
      controller: "TourController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", TourRouterConfig]);

})(window, window.angular);