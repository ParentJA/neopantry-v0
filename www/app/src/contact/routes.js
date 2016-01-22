(function (window, angular, undefined) {

  "use strict";

  function ContactRouterConfig($stateProvider) {
    $stateProvider.state("contact", {
      url: "/contact",
      templateUrl: "/static/contact/views/contact/contact.html",
      controller: "ContactController"
    });
  }

  angular.module("app")
    .config(["$stateProvider", ContactRouterConfig]);

})(window, window.angular);