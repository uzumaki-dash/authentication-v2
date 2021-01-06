// hashing function (md5 module)

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
   extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", usersSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({email: username}, function (err,foundUser) {
    if(!err){
      if(foundUser){
        if(foundUser.password === password)
        res.render("secrets");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server running at Port 3000");
});
