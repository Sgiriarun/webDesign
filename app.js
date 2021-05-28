//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser =require("body-parser");
const ejs =require ("ejs");
const app =express();
const mongoose =require("mongoose");
const encrypt = require("mongoose-encryption");




app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extented:true}));


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true });

////////////////simple schema///////////////////////
// const userSchema= {
//   email:String,
//   password:String
// };

////////////////not usual javascript schema////////////////////
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

console.log(process.env.SECRET);
 const secret=process.env.SECRET;
// const secret = "ThisIsOurLittleSecret";
userSchema.plugin(encrypt, { secret:secret , encryptedFields: ['password'] });
/////////////////mongoose schema for encryptin//////////////////////


const Userdb =new mongoose.model("user",userSchema)

app.get ("/",function(req,res) {
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function (req,res) {
  const newUser =new Userdb({
      email:req.body.username,
      password:req.body.password
  });
newUser.save(function (err) {
  if(!err){
    res.render("secrets");
  }else{
    console.log(err);
  }
});
});

app.post("/login",function (req,res) {
  const username=req.body.username;
  const  passWord=req.body.password;
  Userdb.findOne({email:username}, function (err,foundID) {
    if(!err){console.log(foundID);
      if(passWord===foundID.password){
        res.render("secrets");

      };
    }else{
      console.log(err);
    }
  });
});



app.listen(3000,function () {
  console.log("successfully working on port 3000");
});
