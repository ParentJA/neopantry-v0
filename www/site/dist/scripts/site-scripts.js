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
(function (window, angular, undefined) {

  "use strict";

  function HomeRouterConfig($stateProvider) {
    $stateProvider.state("site.home", {
      url: "/",
      templateUrl: "home/views/home/home.html",
      controller: "HomeController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", HomeRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function PricingRouterConfig($stateProvider) {
    $stateProvider.state("site.pricing", {
      url: "/pricing",
      templateUrl: "pricing/views/pricing/pricing.html",
      controller: "PricingController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", PricingRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function TourRouterConfig($stateProvider) {
    $stateProvider.state("site.tour", {
      url: "/tour",
      templateUrl: "tour/views/tour/tour.html",
      controller: "TourController"
    });
  }

  angular.module("site")
    .config(["$stateProvider", TourRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function AccountsModel($cookies) {
    var service = {
      clearUser: clearUser,
      getUser: getUser,
      hasUser: hasUser,
      setUser: setUser
    };

    function clearUser() {
      $cookies.remove("neopantry-authenticatedUser");
    }

    function getUser() {
      if (!$cookies.get("neopantry-authenticatedUser")) {
        return undefined;
      }

      return JSON.parse($cookies.get("neopantry-authenticatedUser"));
    }

    function hasUser() {
      return !!$cookies.get("neopantry-authenticatedUser");
    }

    function setUser(data) {
      $cookies.put("neopantry-authenticatedUser", JSON.stringify(data.user));
    }

    return service;
  }

  angular.module("site")
    .factory("AccountsModel", ["$cookies", AccountsModel]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function accountsService($http, AccountsModel) {
    var service = {
      getUser: getUser,
      hasUser: hasUser,
      logIn: logIn,
      logOut: logOut,
      signUp: signUp
    };

    function getUser() {
      return AccountsModel.getUser();
    }

    function hasUser() {
      return AccountsModel.hasUser();
    }

    function logIn(username, password) {
      return $http.post("/accounts/log_in/", {
        username: username,
        password: password
      }).then(function (response) {
        AccountsModel.setUser(response.data);
      });
    }

    function logOut() {
      return $http.post("/accounts/log_out/", {}).then(function (response) {
        AccountsModel.clearUser();
      }, function () {
        console.error("Log out failed!");
      });
    }

    function signUp(firstName, lastName, email, password) {
      return $http.post("/accounts/sign_up/", {
        first_name: firstName,
        last_name: lastName,
        username: email,
        email: email,
        password: password
      }).then(function () {
        return logIn(email, password);
      });
    }

    return service;
  }

  angular.module("site")
    .factory("accountsService", ["$http", "AccountsModel", accountsService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function navigationService() {
    var navigationOpen = false;

    var service = {
      closeNavigation: function closeNavigation() {
        navigationOpen = false;
      },
      isNavigationOpen: function isNavigationOpen() {
        return navigationOpen;
      },
      openNavigation: function openNavigation() {
        navigationOpen = true;
      },
      toggleNavigation: function toggleNavigation() {
        navigationOpen = !navigationOpen;
      }
    };

    return service;
  }

  angular.module("site")
    .service("navigationService", [navigationService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function LogInController($scope, $state, $uibModalInstance, accountsService) {
    $scope.error = {};
    $scope.form = "";
    $scope.password = "";
    $scope.username = "";

    $scope.close = function close() {
      $uibModalInstance.close();
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.logIn($scope.username, $scope.password).then(function () {
        //$state.go("site.home");
      }, function (response) {
        $scope.error = response.data;
        $scope.password = "";
      });
    };
  }

  angular.module("site")
    .controller("LogInController", ["$scope", "$state", "$uibModalInstance", "accountsService", LogInController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function SignUpController($scope, $state, $uibModalInstance, accountsService) {
    $scope.email = "";
    $scope.error = {};
    $scope.firstName = "";
    $scope.form = "";
    $scope.lastName = "";
    $scope.password1 = "";
    $scope.password2 = "";

    $scope.close = function close() {
      $uibModalInstance.close();
    };

    $scope.hasError = function hasError() {
      return !_.isEmpty($scope.error);
    };

    $scope.onSubmit = function onSubmit() {
      accountsService.signUp($scope.firstName, $scope.lastName, $scope.email, $scope.password1).then(function () {
        //$state.go("site.home");
      }, function (response) {
        $scope.error = response.data;
        $scope.email = "";
        $scope.password1 = "";
        $scope.password2 = "";
      });
    };
  }

  angular.module("site")
    .controller("SignUpController", ["$scope", "$state", "$uibModalInstance", "accountsService", SignUpController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function ContactController($scope) {

  }

  angular.module("site")
    .controller("ContactController", ["$scope", ContactController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function HomeController($scope) {}

  angular.module("site")
    .controller("HomeController", ["$scope", HomeController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function PricingController($scope) {

  }

  angular.module("site")
    .controller("PricingController", ["$scope", PricingController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function TourController($scope) {

  }

  angular.module("site")
    .controller("TourController", ["$scope", TourController]);

})(window, window.angular);
angular.module('templates').run(['$templateCache', function($templateCache) {$templateCache.put('site.html','{% load staticfiles %}\n\n<!DOCTYPE html>\n<html lang="en" ng-app="site">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport"\n        content="user-scalable=no, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">\n  <title>neopantry</title>\n  <link rel="stylesheet" href="{% static \'styles/vendor-styles.css\' %}">\n  <link rel="stylesheet" href="{% static \'styles/site-styles.css\' %}">\n</head>\n<body ng-controller="MainController">\n<nav class="navbar navbar-default navbar-fixed-top">\n  <div class="container">\n    <div class="navbar-header">\n      <button class="navbar-toggle" type="button" ng-click="navigationService.toggleNavigation()">\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a class="navbar-brand logo" ui-sref="site.home">neopantry</a>\n    </div>\n    <div id="navbar-content" class="collapse navbar-collapse" uib-collapse="!navigationService.isNavigationOpen()">\n      <ul class="nav navbar-nav navbar-right">\n        <li ng-class="{active: $state.is(\'site.home\')}">\n          <a ui-sref="site.home">Home</a>\n        </li>\n        <li ng-class="{active: $state.is(\'site.tour\')}">\n          <a ui-sref="site.tour">Tour</a>\n        </li>\n        <li ng-class="{active: $state.is(\'site.pricing\')}">\n          <a ui-sref="site.pricing">Pricing</a>\n        </li>\n        <li ng-class="{active: $state.is(\'site.contact\')}">\n          <a ui-sref="site.contact">Contact</a>\n        </li>\n        <li ng-if="!hasUser">\n          <a href ng-click="openLogIn()">Log in</a>\n        </li>\n        <li ng-if="!hasUser">\n          <button class="btn btn-primary navbar-btn" ng-click="openSignUp()">Get started</button>\n        </li>\n        <li ng-if="hasUser">\n          <a href ng-click="logOut()">Log out</a>\n        </li>\n        <li ng-if="hasUser">\n          <button class="btn btn-primary navbar-btn" ng-click="viewRecipes()">View recipes</button>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<div class="container">\n  <div ui-view></div>\n</div>\n<script src="{% static \'scripts/vendor-scripts.js\' %}"></script>\n<script src="{% static \'scripts/site-scripts.js\' %}"></script>\n</body>\n</html>');
$templateCache.put('accounts/views/log_in/log_in.html','<div class="modal-body">\n  <button class="close pull-right" type="button" ng-click="close()">&times;</button>\n  <h4 class="text-center mbl">Log in</h4>\n  <form name="form" novalidate ng-submit="onSubmit()">\n    <div class="alert alert-danger" ng-if="hasError()">\n      <strong>{{ error.status }}</strong> {{ error.message }}\n    </div>\n    <div class="form-group">\n      <label for="username">Username:</label>\n      <input id="username" class="form-control" type="text" ng-model="username" required>\n    </div>\n    <div class="form-group">\n      <label for="password">Password:</label>\n      <input id="password" class="form-control" type="password" ng-model="password" required>\n    </div>\n    <button class="btn btn-primary btn-block" type="submit" ng-click="close()" ng-disabled="form.$invalid">Log in\n    </button>\n  </form>\n</div>');
$templateCache.put('accounts/views/sign_up/sign_up.html','<div class="modal-body">\n  <button class="close pull-right" type="button" ng-click="close()">&times;</button>\n  <h4 class="text-center mbl">Sign up</h4>\n  <form name="form" novalidate ng-submit="onSubmit()">\n    <div class="alert alert-danger" ng-if="hasError()">\n      <strong>{{ error.status }}</strong> {{ error.message }}\n    </div>\n    <div class="form-group">\n      <label for="first-name">First name:</label>\n      <input id="first-name" class="form-control" type="text" ng-model="firstName" required>\n    </div>\n    <div class="form-group">\n      <label for="last-name">Last name:</label>\n      <input id="last-name" class="form-control" type="text" ng-model="lastName" required>\n    </div>\n    <div class="form-group">\n      <label for="email">Email address:</label>\n      <input id="email" class="form-control" type="text" ng-model="email" required>\n    </div>\n    <div class="form-group">\n      <label for="password1">Password:</label>\n      <input id="password1" class="form-control" type="password" ng-model="password1" required>\n    </div>\n    <div class="form-group">\n      <label for="password2">Password confirmation:</label>\n      <input id="password2" class="form-control" type="password" ng-model="password2" required>\n    </div>\n    <button class="btn btn-primary btn-block" type="submit" ng-click="close()" ng-disabled="form.$invalid">Sign up\n    </button>\n  </form>\n</div>');
$templateCache.put('contact/views/contact/contact.html','<div class="row">\n  <div class="col-lg-12">\n    <h1>Contact</h1>\n  </div>\n</div>');
$templateCache.put('home/views/home/home.html','<!-- Landing -->\n<div class="row">\n  <div class="col-lg-12">\n    <h1>Family recipes at your fingertips</h1>\n    <p class="lead">\n      Neopantry is...\n    </p>\n    <a class="btn btn-primary btn-lg" href>Learn more</a>\n  </div>\n</div>');
$templateCache.put('pricing/views/pricing/pricing.html','<div class="row">\n  <div class="col-lg-12">\n    <h1>Pricing</h1>\n  </div>\n</div>');
$templateCache.put('tour/views/tour/tour.html','<div class="row">\n  <div class="col-lg-12">\n    <h1>Tour</h1>\n  </div>\n</div>');}]);