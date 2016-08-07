(function (window, angular, undefined) {

  "use strict";

  function HttpConfig($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
  }

  function UiRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("site", {
        url: "/site",
        template: "<div ui-view></div>",
        abstract: true
      });

    $urlRouterProvider.when("/", "/site/");

    //Default state...
    $urlRouterProvider.otherwise("/site/");
  }

  function UiRunner($rootScope, $state, navigationService) {
    $rootScope.$state = $state;
    $rootScope.$on("$stateChangeSuccess", function () {
      navigationService.closeNavigation();
    });
  }

  function MainController($scope, $state, $uibModal, $window, accountsService, navigationService) {
    $scope.hasUser = false;
    $scope.navigationService = navigationService;
    $scope.user = null;

    $scope.logOut = function logOut() {
      accountsService.logOut().then(function () {
        //$state.go("site.home");
      });
    };

    $scope.openLogIn = function openLogIn() {
      $uibModal.open({
        animation: true,
        templateUrl: "accounts/views/log_in/log_in.html",
        controller: "LogInController",
        size: "sm"
      });
    };

    $scope.openSignUp = function openSignUp() {
      $uibModal.open({
        animation: true,
        templateUrl: "accounts/views/sign_up/sign_up.html",
        controller: "SignUpController",
        size: "sm"
      });
    };

    $scope.viewRecipes = function viewRecipes() {
      $window.location.href = "/app";
    };

    $scope.$watch(accountsService.hasUser, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        activate();
      }
    });

    activate();

    function activate() {
      $scope.hasUser = accountsService.hasUser();
      $scope.user = accountsService.getUser();
    }
  }

  angular.module("templates", []);

  angular.module("site", ["ngAnimate", "ngCookies", "ngSanitize", "ui.bootstrap", "ui.router", "templates"])
    .constant("BASE_URL", "/api/v1/")
    .config(["$httpProvider", HttpConfig])
    .config(["$stateProvider", "$urlRouterProvider", UiRouterConfig])
    .run(["$rootScope", "$state", "navigationService", UiRunner])
    .controller("MainController", [
      "$scope", "$state", "$uibModal", "$window", "accountsService", "navigationService", MainController
    ]);

})(window, window.angular);