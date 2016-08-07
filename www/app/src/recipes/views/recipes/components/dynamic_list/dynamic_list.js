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