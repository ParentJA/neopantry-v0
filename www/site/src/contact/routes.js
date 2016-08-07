(function (window, angular, undefined) {

  "use strict";

  function ContactRouterConfig($stateProvider) {
    $stateProvider.state("site.contact", {
      url: "/contact",
      templateUrl: "contact/views/contact/contact.html",
      controller: "ContactController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", ContactRouterConfig]);

})(window, window.angular);