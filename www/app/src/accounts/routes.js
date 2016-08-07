(function (window, angular, undefined) {

  "use strict";

  function AccountsRouterConfig($stateProvider) {
    $stateProvider
      .state("sign_up", {
        url: "/sign_up",
        templateUrl: "/static/accounts/views/sign_up/sign_up.html",
        controller: "SignUpController"
      })
      .state("log_in", {
        url: "/log_in",
        templateUrl: "/static/accounts/views/log_in/log_in.html",
        controller: "LogInController"
      });
  }

  angular.module("app")
    .config(["$stateProvider", AccountsRouterConfig]);

})(window, window.angular);