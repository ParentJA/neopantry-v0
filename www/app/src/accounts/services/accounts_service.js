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