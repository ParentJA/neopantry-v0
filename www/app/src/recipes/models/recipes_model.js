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