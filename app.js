const express = require("express");
const app = express();
const router = require("./server/routes/route");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const multer = require("multer");
require("./server/middlewares/uploader");

mongoose
  .connect("mongodb://localhost/nodeBlog4", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//1. ejs
app.set("view engine", "ejs");
// 2.set views folder to render
app.set("views", __dirname + "/views");
// 3.set layout folder to render
app.use(expressLayout);
app.set("layout", "./layout/main_layout");

//3. use static files eg. images/css/js
app.use("/public", express.static(__dirname + "/public"));

// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// router
app.use("/api", router);
app.use(function (req, res, next) {
  res.json("Page not found.").status(500);
});
// app.get("/", function (req, res) {
//   res.render("pages/index");
// });

app.listen(9090, function () {
  console.log("app is working");
});
