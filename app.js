// part of level 3 security
require('dotenv').config();
// -------------------------- //
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
// this is the basic level 1 security, to spice things up we gonna modify it
// const userSchema = {
//   email: String,
//   password: String
// };

// part 1 of updating our level 1 security
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// part 2 of updating our level 1 security
// const secret = "Thisisourlittlesecret"; ---transfered to .env for level 3 security


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);
// there is no SECRETS route as we only want users who registered to be able to view this route
// as we mention bellow!
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
   newUser.save(function(err){
     if (err) {
       console.log(err);
     }else{
       res.render("secrets");
     }
   });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000, function(){
  console.log("Listening on port 3000...");
});
