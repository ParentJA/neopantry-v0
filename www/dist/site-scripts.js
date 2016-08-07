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
        templateUrl: "/static/accounts/views/log_in/log_in.html",
        controller: "LogInController",
        size: "sm"
      });
    };

    $scope.openSignUp = function openSignUp() {
      $uibModal.open({
        animation: true,
        templateUrl: "/static/accounts/views/sign_up/sign_up.html",
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

  angular.module("site", ["ngAnimate", "ngCookies", "ngSanitize", "ui.bootstrap", "ui.router"])
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
        templateUrl: "/static/accounts/views/sign_up/sign_up.html",
        controller: "SignUpController"
      })
      .state("log_in", {
        url: "/log_in",
        templateUrl: "/static/accounts/views/log_in/log_in.html",
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
      templateUrl: "/static/contact/views/contact/contact.html",
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
      templateUrl: "/static/home/views/home/home.html",
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
      templateUrl: "/static/pricing/views/pricing/pricing.html",
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
      templateUrl: "/static/tour/views/tour/tour.html",
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

  function ContactController($scope) {

  }

  angular.module("site")
    .controller("ContactController", ["$scope", ContactController]);

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