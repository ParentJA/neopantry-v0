(function (window, angular, undefined) {

  "use strict";

  function PricingRouterConfig($stateProvider) {
    $stateProvider.state("pricing", {
      url: "/pricing",
      templateUrl: "/static/pricing/views/pricing/pricing.html",
      controller: "PricingController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", PricingRouterConfig]);

})(window, window.angular);