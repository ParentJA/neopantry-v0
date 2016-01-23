(function (window, angular, undefined) {

  "use strict";

  function PricingRouterConfig($stateProvider) {
    $stateProvider.state("site.pricing", {
      url: "/pricing",
      templateUrl: "/static/pricing/views/pricing/pricing.html",
      controller: "PricingController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", PricingRouterConfig]);

})(window, window.angular);