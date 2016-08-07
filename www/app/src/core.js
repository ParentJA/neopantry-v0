(function (window, angular, undefined) {

  "use strict";

  function HttpConfig($httpProvider) {
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
  }

  function UiRouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("app", {
        url: "/app",
        template: "<div ui-view></div>",
        resolve: {
          recipes: function (recipesModel, loadRecipesService) {
            if (_.isEmpty(recipesModel.getRecipes())) {
              return loadRecipesService();
            }

            return recipesModel;
          }
        },
        abstract: true
      });

    //Default state...
    $urlRouterProvider.otherwise("/app/recipes/list");
  }

  function UiRunner($rootScope, $state, navigationService) {
    $rootScope.$state = $state;
    $rootScope.$on("$stateChangeSuccess", function () {
      navigationService.closeNavigation();
    });
  }

  function MainController($scope, $state, $uibModal, accountsService, navigationService) {
    //$scope.hasUser = false;
    $scope.navigationService = navigationService;
    //$scope.user = null;

    /*$scope.logOut = function logOut() {
      accountsService.logOut().then(function () {
        $state.go("home");
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

    $scope.$watch(accountsService.hasUser, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        activate();
      }
    });

    activate();

    function activate() {
      $scope.hasUser = accountsService.hasUser();
      $scope.user = accountsService.getUser();
    }*/
  }

  angular.module("templates", []);

  angular.module("app", ["ngAnimate", "ngCookies", "ngSanitize", "ui.bootstrap", "ui.router", "templates"])
    .constant("BASE_URL", "/api/v1/")
    .config(["$httpProvider", HttpConfig])
    .config(["$stateProvider", "$urlRouterProvider", UiRouterConfig])
    .run(["$rootScope", "$state", "navigationService", UiRunner])
    .controller("MainController", [
      "$scope", "$state", "$uibModal", "accountsService", "navigationService", MainController
    ]);

})(window, window.angular);