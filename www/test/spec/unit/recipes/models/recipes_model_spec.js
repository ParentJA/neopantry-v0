describe("a recipe model", function () {

  var recipesModel;

  var tomatoes = {
    id: 1,
    name: "tomatoes"
  };

  var onions = {
    id: 2,
    name: "onions"
  };

  var tomatillos = {
    id: 3,
    name: "tomatillos"
  };

  var recipe1 = {
    id: 1,
    name: "Recipe 1",
    foods: [1]
  };

  var recipe2 = {
    id: 2,
    name: "Recipe 2",
    foods: [1, 2]
  };

  var recipe3 = {
    id: 3,
    name: "Recipe 3",
    foods: [1, 2, 3]
  };

  var responseData = {
    foods: [tomatoes, onions, tomatillos],
    recipes: [recipe1, recipe2, recipe3],
    ingredients: [{
      id: 1,
      description: "",
      recipe: 1,
      food: 1
    }, {
      id: 2,
      description: "",
      recipe: 2,
      food: 1
    }, {
      id: 3,
      description: "",
      recipe: 2,
      food: 2
    }, {
      id: 4,
      description: "",
      recipe: 3,
      food: 1
    }, {
      id: 5,
      description: "",
      recipe: 3,
      food: 2
    }, {
      id: 6,
      description: "",
      recipe: 3,
      food: 3
    }]
  };

  beforeEach(function () {
    module("app");

    inject(function ($injector) {
      recipesModel = $injector.get("recipesModel");
    });
  });

  it("should add a selected food", function () {
    recipesModel.addSelectedFood({
      id: 1,
      name: "tomatoes"
    });

    expect(recipesModel.hasSelectedFoods()).toBe(true);

    expect(recipesModel.getSelectedFoods()).toEqual([{
      id: 1,
      name: "tomatoes"
    }]);
  });

  it("should change a selected recipe", function () {
    recipesModel.setSelectedRecipe({
      id: 1,
      name: "Pico de Gallo",
      foods: [1]
    });

    expect(recipesModel.getSelectedRecipe()).toEqual({
      id: 1,
      name: "Pico de Gallo",
      foods: [1]
    });

    expect(recipesModel.isSelectedRecipe(recipesModel.getSelectedRecipe())).toBe(true);
  });

  it("should update the information for a collection of recipes", function () {
    // Confirm that the models has an update() method...
    expect(recipesModel.update).toBeDefined();

    recipesModel.update(responseData);
  });

  it("should find recipes with given foods", function () {
    recipesModel.update(responseData);

    // Best matches for recipes that have one ingredient--tomatoes:
    // All include tomatoes, so all are best matches...
    expect(recipesModel.searchByFoods([tomatoes])).toEqual([recipe1, recipe2, recipe3]);

    // Best matches for recipes that have two ingredients--tomatoes and onions:
    // Two include tomatoes and onions, so two are best matches...
    expect(recipesModel.searchByFoods([tomatoes, onions])).toEqual([recipe2, recipe3]);

    // Best matches for recipes that have three ingredients--tomatoes, onions, and tomatillos:
    // Three include tomatoes, onions, and tomatillos, so three are best matches...
    expect(recipesModel.searchByFoods([tomatoes, onions, tomatillos])).toEqual([recipe3]);
  });

  describe("a recipe model that has already been updated", function () {

    beforeEach(function () {
      recipesModel.update(responseData);
    });

    it("should update the information for a single recipe", function () {
      // Confirm that the model has an updateOne() method...
      expect(recipesModel.updateOne).toBeDefined();

      var recipeId = 1;
      var description = "A delicious mixture of chopped vegetables.";
      var instructions = "<ol><li>Chop vegetables.</li><li>Combine.</li></ol>";

      // Example response data...
      var data = {
        description: description,
        id: recipeId,
        instructions: instructions
      };

      recipesModel.updateOne(data);

      var recipe = recipesModel.getRecipe(recipeId);

      // Confirm that a description and instructions have been added to the recipe...
      expect(recipe.description).toEqual(description);
      expect(recipe.instructions).toEqual(instructions);
    });

    it("should get a list of foods", function () {
      var foods = recipesModel.getFoods();

      expect(foods).toEqual([tomatoes, onions, tomatillos]);
    });

  });

});