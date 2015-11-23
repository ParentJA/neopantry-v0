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