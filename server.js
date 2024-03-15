const express = require("express");
const expbs = require("express-handlebars");
const path = require("path");
const routes = require("./routes/mainRoutes");
const app = express();

const partialsDir = path.join(__dirname, "views/components");
console.log("Partials directory:", partialsDir); // Debug log

const hbs = expbs.create({
  defaultLayout: "mainLayout",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: partialsDir,
  helpers: {
    calculation: function (value) {
      return value * 5;
    },

    list: function (value, options) {
      let out = "<ul>";
      for (let i = 0; i < value.length; i++) {
        out = out + "<li>" + options.fn(value[i]) + "</li>";
      }
      return out + "</ul>";
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static("dist"));
app.use(express.static("src"));
// Use the routes
app.use("/", routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
