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