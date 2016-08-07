(function (window, angular, undefined) {

  "use strict";

  function TourRouterConfig($stateProvider) {
    $stateProvider.state("site.tour", {
      url: "/tour",
      templateUrl: "/static/tour/views/tour/tour.html",
      controller: "TourController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", TourRouterConfig]);

})(window, window.angular);