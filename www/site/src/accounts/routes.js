(function (window, angular, undefined) {

  "use strict";

  function AccountsRouterConfig($stateProvider) {
    $stateProvider
      .state("sign_up", {
        url: "/sign_up",
        templateUrl: "accounts/views/sign_up/sign_up.html",
        controller: "SignUpController"
      })
      .state("log_in", {
        url: "/log_in",
        templateUrl: "accounts/views/log_in/log_in.html",
        controller: "LogInController"
      });
  }

  angular.module("site")
    .config(["$stateProvider", AccountsRouterConfig]);

})(window, window.angular);