const mongoose=require('mongoose'); 

mongoose.connect("url").then(console.log("DB connected Successfully!"));

const UserSchema=new mongoose.Schema({
    name:{type:String, required:true},
    phn_no:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:String,
});

const User=mongoose.model("User",UserSchema);
module.exports=User;
