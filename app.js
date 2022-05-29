//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/recipeDB", {
  useNewUrlParser: true,
});

const recipeSchema = {
  name: String,
  ingredients: [String],
  instructions: [String],
};

const Recipe = mongoose.model("Recipe", recipeSchema);

app
  .route("/recipes")
  .get(function (req, res) {
    Recipe.find(function (err, foundRecipes) {
      // await Recipe.find({ name: Recipe.name }, 'name').exec();
      if (!err) {
        res.send(foundRecipes);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newRecipe = new Recipe({
      name: req.body.name,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
    });

    newRecipe.save(function (err) {
      if (!err) {
        res.send("Recipe added Successfully!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Recipe.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted all recipes. Good luck eating!");
      } else {
        res.send(err);
      }
    });
  });

/////////////// For the request targetting single recipe  //////////////

app
  .route("/recipes/:recipeName")

  .get(function (req, res) {
    Recipe.findOne(
      { name: req.params.recipeName },
      function (err, foundRecipe) {
        if (!err) {
          res.send(foundRecipe);
        } else {
          res.send("No Recipe exists with the given name");
        }
      }
    );
  })

  .put(function (req, res) {
    Recipe.findOneAndUpdate(
      { name: req.params.recipeName },
      {
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
      },
      { upsert: false, overwrite: true },

      function (err) {
        if (!err) {
          res.send("Recipe updated successfully!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function (req, res) {
    Recipe.updateOne(
      { name: req.params.recipeName },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Recipe Patched successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Recipe.deleteOne({ name: req.params.recipeName }, function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding Recipe");
      } else {
        res.send(err);
      }
    });
  });

//THINGS TO DO //

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
