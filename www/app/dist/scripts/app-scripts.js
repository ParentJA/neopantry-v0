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

  angular.module("app")
    .config(["$stateProvider", AccountsRouterConfig]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipesRouterConfig($stateProvider) {
    $stateProvider
      .state("app.recipes", {
        url: "/recipes",
        templateUrl: "recipes/views/recipes/recipes.html",
        controller: "RecipesController"
      })
      .state("app.recipes.list", {
        url: "/list",
        templateUrl: "recipes/views/recipes/components/recipe_list/recipe_list.html",
        controller: "RecipeListController"
      })
      .state("app.recipes.detail", {
        url: "/detail/:recipeId",
        templateUrl: "recipes/views/recipes/components/recipe_detail/recipe_detail.html",
        controller: "RecipeDetailController",
        resolve: {
          recipe: function ($stateParams, loadRecipeService, recipes, recipesModel) {
            var recipeId = $stateParams.recipeId;
            var recipe = _.find(recipes, "id", _.parseInt(recipeId));

            if (!recipesModel.isFullRecipe(recipe)) {
              return loadRecipeService(recipeId);
            }

            return recipe;
          }
        }
      })
      .state("app.recipes.match_list", {
        url: "/match_list",
        templateUrl: "recipes/views/recipes/components/food_match_list/food_match_list.html",
        controller: "FoodMatchListController"
      });
  }

  angular.module("app")
    .config(["$stateProvider", RecipesRouterConfig]);

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

  angular.module("app")
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

  angular.module("app")
    .factory("accountsService", ["$http", "AccountsModel", accountsService]);

})(window, window.angular);
(function (window, angular, undefined) {

  function recipesModel() {
    var foods = [];
    var recipes = [];
    var selectedFoods = [];
    var selectedRecipe = {};

    this.addSelectedFood = function addSelectedFood(food) {
      if (!_.includes(selectedFoods, food)) {
        selectedFoods.push(food);
      }
    };

    this.getFoods = function getFoods() {
      return foods;
    };

    this.getRecipe = function getRecipe(id) {
      return _.find(recipes, "id", _.parseInt(id));
    };

    this.getRecipes = function getRecipes() {
      return recipes;
    };

    this.getSelectedFoods = function getSelectedFoods() {
      return selectedFoods;
    };

    this.getSelectedRecipe = function getSelectedRecipe() {
      if (_.isEmpty(selectedRecipe)) {
        return _.first(_.sortBy(recipes, "name"));
      }

      return selectedRecipe;
    };

    this.getTotalRecipes = function getTotalRecipes() {
      return _.size(recipes);
    };

    this.hasRecipes = function hasRecipes() {
      return !_.isEmpty(recipes);
    };

    this.hasSelectedFoods = function hasSelectedFoods() {
      return !_.isEmpty(selectedFoods);
    };

    this.isFullRecipe = function isFullRecipe(recipe) {
      return (_.has(recipe, "description") && _.has(recipe, "instructions"));
    };

    this.isSelectedRecipe = function isSelectedRecipe(recipe) {
      return _.isEqual(recipe, selectedRecipe);
    };

    this.removeSelectedFood = function removeSelectedFood(food) {
      _.remove(selectedFoods, food);
    };

    this.setSelectedRecipe = function setSelectedRecipe(recipe) {
      selectedRecipe = recipe;
    };

    this.searchByFoods = function searchByFoods(foods) {
      if (_.isEmpty(foods)) {
        return [];
      }

      var rankMap = {};

      _.forEach(foods, function (food) {
        var recipesWithFood = _.filter(recipes, function (recipe) {
          return _.includes(recipe.foods, food.id);
        });

        _.forEach(recipesWithFood, function (recipe) {
          if (!_.has(rankMap, recipe.id)) {
            rankMap[recipe.id] = 0;
          }

          rankMap[recipe.id] += 1;
        });
      });

      var invertedRankMap = _.invert(rankMap, true);
      var bestMatchesIndex = _.last(_.keys(invertedRankMap).sort());
      var bestMatches = invertedRankMap[bestMatchesIndex];

      return _.filter(recipes, function (recipe) {
        return _.includes(bestMatches, recipe.id.toString());
      });
    };

    this.update = function update(data) {
      var foodMap = _.indexBy(data.foods, "id");

      _.forEach(data.recipes, function (recipe) {
        recipe.ingredients = [];

        _.forEach(data.ingredients, function (ingredient) {
          if (ingredient.recipe === recipe.id) {
            recipe.ingredients.push({
              id: ingredient.id,
              description: ingredient.description,
              food: foodMap[ingredient.food]
            });
          }
        });
      });

      foods = data.foods;
      recipes = data.recipes;
    };

    this.updateOne = function updateOne(data) {
      var recipe = _.find(recipes, "id", data.id);
      recipe.description = data.description;
      recipe.instructions = data.instructions;
    };
  }

  angular.module("app")
    .service("recipesModel", [recipesModel]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  var SearchType = {
    RECIPE_NAME: {
      key: "recipe name"
    },
    INGREDIENTS: {
      key: "ingredients"
    }
  };

  angular.module("app")
    .constant("SearchType", SearchType);

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

  angular.module("app")
    .service("navigationService", [navigationService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function loadRecipeService($http, $q, BASE_URL, recipesModel) {

    return function (recipeId) {
      var deferred = $q.defer();

      $http.get(BASE_URL + "recipes/" + recipeId + "/").then(function (response) {
        recipesModel.updateOne(response.data);
        deferred.resolve(recipesModel.getRecipe(recipeId));
      }, function (response) {
        console.error("Recipe %d failed to load!", recipeId);
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .factory("loadRecipeService", ["$http", "$q", "BASE_URL", "recipesModel", loadRecipeService]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function loadRecipesService($http, $q, BASE_URL, recipesModel) {

    return function () {
      var deferred = $q.defer();

      $http.get(BASE_URL + "recipes/").then(function (response) {
        recipesModel.update(response.data);
        deferred.resolve(recipesModel);
      }, function (response) {
        console.error("Recipes failed to load!");
        deferred.reject(response.data);
      });

      return deferred.promise;
    };
  }

  angular.module("app")
    .factory("loadRecipesService", ["$http", "$q", "BASE_URL", "recipesModel", loadRecipesService]);

})(window, window.angular);
(function (window, angular, undefined) {

  function searchTypeService(SearchType) {
    var selectedSearchType = SearchType.RECIPE_NAME;

    this.changeSearchType = function changeSearchType(searchType) {
      selectedSearchType = searchType;
    };

    this.getSearchType = function getSearchType() {
      return selectedSearchType;
    };

    this.isIngredients = function isIngredients() {
      return selectedSearchType === SearchType.INGREDIENTS;
    };

    this.isRecipeName = function isRecipeName() {
      return selectedSearchType === SearchType.RECIPE_NAME;
    };
  }

  angular.module("app")
    .service("searchTypeService", ["SearchType", searchTypeService]);

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
        $state.go("app.recipes.list");
      }, function (response) {
        $scope.error = response.data;
        $scope.password = "";
      });
    };
  }

  angular.module("app")
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
        $state.go("app.recipes.list");
      }, function (response) {
        $scope.error = response.data;
        $scope.email = "";
        $scope.password1 = "";
        $scope.password2 = "";
      });
    };
  }

  angular.module("app")
    .controller("SignUpController", ["$scope", "$state", "$uibModalInstance", "accountsService", SignUpController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipesController($scope, $state, recipes, SearchType, searchTypeService) {
    $scope.hasRecipes = false;
    $scope.matchingRecipes = [];
    $scope.recipes = [];
    $scope.SearchType = SearchType;
    $scope.totalRecipes = 0;

    $scope.addSelectedFood = function addSelectedFood(food) {
      recipes.addSelectedFood(food);
    };

    $scope.changeSearchType = function changeSearchType(searchType) {
      searchTypeService.changeSearchType(searchType);
    };

    $scope.getFoods = function getFoods() {
      return recipes.getFoods();
    };

    $scope.getSelectedFoods = function getSelectedFoods() {
      return recipes.getSelectedFoods();
    };

    $scope.isIngredients = function isIngredients() {
      return searchTypeService.isIngredients();
    };

    $scope.isRecipeName = function isRecipeName() {
      return searchTypeService.isRecipeName();
    };

    $scope.isSelectedRecipe = function isSelectedRecipe(value) {
      return recipes.isSelectedRecipe(value);
    };

    /*$scope.onKeyPressed = function onKeyPressed(event) {
      if (event.keyCode === 13) {
        $state.go("app.recipes.detail", {
          recipeId: $scope.recipe.id
        });

        // Clear recipe...
        $scope.recipe = null;
      }
    };*/

    $scope.removeSelectedFood = function removeSelectedFood(food) {
      recipes.removeSelectedFood(food);
    };

    $scope.setSelectedRecipe = function setSelectedRecipe(value) {
      recipes.setSelectedRecipe(value);
    };

    $scope.$watchCollection(recipes.getSelectedFoods, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.hasRecipes = recipes.hasRecipes();
        $scope.matchingRecipes = getMatchingRecipes();
        $scope.recipes = recipes.getRecipes();
        $scope.totalRecipes = _.size($scope.recipes);
      }
    });

    activate();

    function activate() {
      $scope.hasRecipes = recipes.hasRecipes();
      $scope.matchingRecipes = getMatchingRecipes();
      $scope.recipes = recipes.getRecipes();
      $scope.totalRecipes = _.size($scope.recipes);
    }

    function getMatchingRecipes() {
      return recipes.searchByFoods(recipes.getSelectedFoods());
    }
  }

  angular.module("app")
    .controller("RecipesController", ["$scope", "$state", "recipes", "SearchType", "searchTypeService", RecipesController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function FoodMatchListController($scope, recipesModel) {
    $scope.hasSelectedFoods = false;

    $scope.$watch(recipesModel.hasSelectedFoods, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.hasSelectedFoods = newValue;
      }
    });

    activate();

    function activate() {
      $scope.hasSelectedFoods = recipesModel.hasSelectedFoods();
    }
  }

  angular.module("app")
    .controller("FoodMatchListController", ["$scope", "recipesModel", FoodMatchListController]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipeController($scope) {}

  function recipe() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "recipes/views/recipes/components/recipe/recipe.html",
      controller: "RecipeController"
    };
  }

  angular.module("app")
    .directive("recipe", ["$scope", recipe]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function DynamicListController($scope) {
    $scope.collection = [];
    $scope.elements = [];
    $scope.name = null;

    $scope.addElement = function addElement(name) {
      var element = _.find($scope.getCollection(), {name: name});

      if (!_.isEmpty(element) && !_.includes($scope.getElements(), element)) {
        $scope.addFn({element: element});
      }
    };

    $scope.onKeyPressed = function onKeyPressed(event) {
      if (event.keyCode === 13) {
        $scope.addElement($scope.name);
        $scope.name = null;
      }
    };

    $scope.removeElement = function removeElement(element) {
      $scope.removeFn({element: element});
    };

    $scope.$watchCollection($scope.getCollection, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.collection = newValue;
      }
    });

    $scope.$watchCollection($scope.getElements, function (newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        $scope.elements = newValue;
      }
    });

    activate();

    function activate() {
      $scope.collection = $scope.getCollection();
      $scope.elements = $scope.getElements();
    }
  }

  function dynamicList() {
    return {
      restrict: "A",
      scope: {
        getCollection: "&collection",
        getElements: "&elements",
        addFn: "&",
        removeFn: "&",
        placeholder: "@",
        button: "@"
      },
      templateUrl: "recipes/views/recipes/components/dynamic_list/dynamic_list.html",
      controller: "DynamicListController"
    };
  }

  angular.module("app")
    .controller("DynamicListController", ["$scope", DynamicListController])
    .directive("dynamicList", [dynamicList]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipeDetailController($scope, recipe, recipes) {
    $scope.recipe = recipe;
    $scope.recipeIngredients = [];
    $scope.totalFoods = 0;

    activate();

    function activate() {
      $scope.recipeIngredients = _.map(recipe.ingredients, "description");
      $scope.totalFoods = _.size(recipe.foods);
    }
  }

  function recipeDetail() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "recipes/views/recipes/components/recipe_detail/recipe_detail.html",
      controller: "RecipeDetailController"
    };
  }

  angular.module("app")
    .controller("RecipeDetailController", ["$scope", "recipe", "recipes", RecipeDetailController])
    .directive("recipeDetail", [recipeDetail]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipeListController($scope) {}

  function recipeList() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "recipes/views/recipes/components/recipe_list/recipe_list.html",
      controller: "RecipeListController"
    };
  }

  angular.module("app")
    .controller("RecipeListController", ["$scope", RecipeListController])
    .directive("recipeList", [recipeList]);

})(window, window.angular);
(function (window, angular, undefined) {

  "use strict";

  function RecipeSearchFilterController($scope, SearchType, searchTypeService) {
    $scope.SearchType = SearchType;

    $scope.changeSearchType = function changeSearchType(searchType) {
      searchTypeService.changeSearchType(searchType);
    };
  }

  function recipeSearchFilter() {
    return {
      restrict: "A",
      scope: {},
      templateUrl: "recipes/views/recipes/components/recipe_search_filter/recipe_search_filter.html",
      controller: "RecipeSearchFilterController"
    };
  }

  angular.module("app")
    .controller("RecipeSearchFilterController", [
      "$scope", "SearchType", "searchTypeService", RecipeSearchFilterController
    ])
    .directive("recipeSearchFilter", [recipeSearchFilter]);

})(window, window.angular);
angular.module('templates').run(['$templateCache', function($templateCache) {$templateCache.put('app.html','{% load staticfiles %}\n\n<!DOCTYPE html>\n<html lang="en" ng-app="app">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport"\n        content="user-scalable=no, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">\n  <title>neopantry</title>\n  <link rel="stylesheet" href="{% static \'styles/vendor-styles.css\' %}">\n  <link rel="stylesheet" href="{% static \'styles/app-styles.css\' %}">\n</head>\n<body ng-controller="MainController">\n<nav class="navbar navbar-default navbar-fixed-top">\n  <div class="container">\n    <div class="navbar-header">\n      <button class="navbar-toggle" type="button" ng-click="navigationService.toggleNavigation()">\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a class="navbar-brand logo" href="/">neopantry</a>\n    </div>\n    <div id="navbar-content" class="collapse navbar-collapse" uib-collapse="!navigationService.isNavigationOpen()">\n      <ul class="nav navbar-nav navbar-right">\n        <li ng-class="{active: $state.is(\'app.recipes.list\')}">\n          <a ui-sref="app.recipes.list">Recipes</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>\n<div class="container">\n  <div ui-view></div>\n</div>\n<script src="{% static \'scripts/vendor-scripts.js\' %}"></script>\n<script src="{% static \'scripts/app-scripts.js\' %}"></script>\n</body>\n</html>');
$templateCache.put('accounts/views/log_in/log_in.html','<div class="modal-body">\n  <button class="close pull-right" type="button" ng-click="close()">&times;</button>\n  <h4 class="text-center mbl">Log in</h4>\n  <form name="form" novalidate ng-submit="onSubmit()">\n    <div class="alert alert-danger" ng-if="hasError()">\n      <strong>{{ error.status }}</strong> {{ error.message }}\n    </div>\n    <div class="form-group">\n      <label for="username">Username:</label>\n      <input id="username" class="form-control" type="text" ng-model="username" required>\n    </div>\n    <div class="form-group">\n      <label for="password">Password:</label>\n      <input id="password" class="form-control" type="password" ng-model="password" required>\n    </div>\n    <button class="btn btn-primary btn-block" type="submit" ng-click="close()" ng-disabled="form.$invalid">Log in\n    </button>\n  </form>\n</div>');
$templateCache.put('accounts/views/sign_up/sign_up.html','<div class="modal-body">\n  <button class="close pull-right" type="button" ng-click="close()">&times;</button>\n  <h4 class="text-center mbl">Sign up</h4>\n  <form name="form" novalidate ng-submit="onSubmit()">\n    <div class="alert alert-danger" ng-if="hasError()">\n      <strong>{{ error.status }}</strong> {{ error.message }}\n    </div>\n    <div class="form-group">\n      <label for="first-name">First name:</label>\n      <input id="first-name" class="form-control" type="text" ng-model="firstName" required>\n    </div>\n    <div class="form-group">\n      <label for="last-name">Last name:</label>\n      <input id="last-name" class="form-control" type="text" ng-model="lastName" required>\n    </div>\n    <div class="form-group">\n      <label for="email">Email address:</label>\n      <input id="email" class="form-control" type="text" ng-model="email" required>\n    </div>\n    <div class="form-group">\n      <label for="password1">Password:</label>\n      <input id="password1" class="form-control" type="password" ng-model="password1" required>\n    </div>\n    <div class="form-group">\n      <label for="password2">Password confirmation:</label>\n      <input id="password2" class="form-control" type="password" ng-model="password2" required>\n    </div>\n    <button class="btn btn-primary btn-block" type="submit" ng-click="close()" ng-disabled="form.$invalid">Sign up\n    </button>\n  </form>\n</div>');
$templateCache.put('recipes/views/recipes/recipes.html','<div class="row">\n  <div class="col-md-offset-3 col-md-6">\n    <div ui-view></div>\n  </div>\n</div>');
$templateCache.put('recipes/views/recipes/components/food_match_list/food_match_list.html','<div class="component--food-match-list">\n  <ol class="breadcrumb">\n    <li>\n      <a href ui-sref="app.recipes.list">Recipes</a>\n    </li>\n    <li class="active">Matching Recipes</li>\n  </ol>\n  <h2 class="text-center">Matching Recipes</h2>\n  <p class="text-center">\n    <ng-pluralize count="matchingRecipes.length" when="{\n      \'0\': \'No matching recipes\',\n      \'one\': \'1 matching recipe\',\n      \'other\': \'{} matching recipes\'\n    }"></ng-pluralize>\n  </p>\n  <span class="text-center" ng-hide="hasSelectedFoods">No matching recipes</span>\n  <table class="table table-hover">\n    <tbody>\n    <tr ng-repeat="recipe in matchingRecipes | orderBy: \'name\'"\n        ng-click="setSelectedRecipe(recipe)"\n        ui-sref="app.recipes.detail({recipeId: recipe.id})">\n      <td ng-bind-html="recipe.name"></td>\n    </tr>\n    </tbody>\n  </table>\n</div>');
$templateCache.put('recipes/views/recipes/components/recipe/recipe.html','<div class="component--recipe">\n\n</div>');
$templateCache.put('recipes/views/recipes/components/dynamic_list/dynamic_list.html','<div class="component--dynamic-list">\n  <div class="input-group">\n    <input class="form-control" type="text" placeholder="{{ placeholder }}" ng-model="name"\n           ng-keypress="onKeyPressed($event)" typeahead-min-length="2"\n           uib-typeahead="item.name for item in collection | filter: $viewValue | limitTo: 10">\n    <span class="input-group-btn">\n      <div x-recipe-search-filter class="btn-group" uib-dropdown></div>\n      <button class="btn btn-default" type="button" ng-click="addElement(name)">{{ button }}</button>\n    </span>\n  </div>\n  <ul class="list-group">\n    <li class="list-group-item" ng-repeat="element in elements">\n      <span>{{ element.name }}</span>\n      <span class="close pull-right" ng-click="removeElement(element)">&times;</span>\n    </li>\n  </ul>\n</div>');
$templateCache.put('recipes/views/recipes/components/recipe_detail/recipe_detail.html','<div class="component--recipe-detail">\n\n  <!-- Breadbcrumbs -->\n  <ol class="breadcrumb">\n    <li>\n      <a href ui-sref="app.recipes.list">Recipes</a>\n    </li>\n    <li class="active" ng-bind-html="recipe.name"></li>\n  </ol>\n\n  <!-- Name -->\n  <h2 class="text-center" ng-bind-html="recipe.name"></h2>\n\n  <!-- Description -->\n  <p ng-bind-html="recipe.description" ng-if="recipe.description"></p>\n\n  <!-- Ingredients -->\n  <h3 class="mhm">Ingredients <span class="label label-default pull-right" ng-bind="totalFoods"></span></h3>\n  <ul class="ingredients-list">\n    <li ng-repeat="ingredient in recipeIngredients">\n      <span ng-bind-html="ingredient"></span>\n    </li>\n  </ul>\n\n  <!-- Instructions -->\n  <h3 class="mhm" ng-if="recipe.instructions">Instructions</h3>\n  <div class="instructions" ng-bind-html="recipe.instructions" ng-if="recipe.instructions"></div>\n\n</div>');
$templateCache.put('recipes/views/recipes/components/recipe_list/recipe_list.html','<div class="component--recipe-list">\n  <h2 class="text-center">My Recipes</h2>\n  <p class="text-center" ng-if="isRecipeName()">\n    {{ totalRecipes }} total recipes\n  </p>\n  <p class="text-center" ng-if="isIngredients()">\n    <a href ui-sref="app.recipes.match_list">\n      <ng-pluralize count="matchingRecipes.length" when="{\n        \'0\': \'No matching recipes\',\n        \'one\': \'1 matching recipe\',\n        \'other\': \'{} matching recipes\'\n      }"></ng-pluralize>\n    </a>\n  </p>\n\n  <!-- Recipe name search -->\n  <div class="input-group" ng-if="isRecipeName()">\n    <!-- TODO: Remove ng-keypress="onKeyPressed($event)"? -->\n    <input class="form-control"\n           type="text"\n           placeholder="Enter recipe name..."\n           ng-model="recipe"\n           typeahead-min-length="2"\n           uib-typeahead="recipe as recipe.name for recipe in recipes | filter: {name: $viewValue} | limitTo: 10">\n    <span class="input-group-btn">\n      <div x-recipe-search-filter class="btn-group" uib-dropdown></div>\n      <a class="btn btn-default" href ui-sref="app.recipes.detail({recipeId: recipe.id})">\n        <span class="glyphicon glyphicon-search"></span>\n      </a>\n    </span>\n  </div>\n\n  <!-- Recipe name search -->\n  <!--<div ng-if="isRecipeName()">\n    <div class="form-group">\n      <input class="form-control" type="text" placeholder="Enter recipe name..." ng-model="recipeName">\n    </div>\n    <ul class="media-list">\n      <li class="media" ng-repeat="recipe in recipes | filter: {name: recipeName}">\n        <div class="media-body">\n          <h4 class="media-heading">\n            <a ng-bind-html="recipe.name" ui-sref="app.recipes.detail({recipeId: recipe.id})"></a>\n          </h4>\n        </div>\n      </li>\n    </ul>\n  </div>-->\n\n  <!-- Ingredients search -->\n  <div x-dynamic-list\n       data-collection="getFoods()"\n       data-elements="getSelectedFoods()"\n       data-add-fn="addSelectedFood(element)"\n       data-remove-fn="removeSelectedFood(element)"\n       data-placeholder="Enter a food..."\n       data-button="Add food"\n       ng-if="isIngredients()"></div>\n\n</div>');
$templateCache.put('recipes/views/recipes/components/recipe_search_filter/recipe_search_filter.html','<a class="btn btn-default" href uib-dropdown-toggle>\n  <span class="caret"></span>\n</a>\n<ul class="dropdown-menu dropdown-menu-right">\n  <li>\n    <a href ng-click="changeSearchType(SearchType.RECIPE_NAME)">By Recipe Name</a>\n  </li>\n  <li>\n    <a href ng-click="changeSearchType(SearchType.INGREDIENTS)">By Ingredients</a>\n  </li>\n</ul>');}]);