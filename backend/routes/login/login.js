const router = require('express').Router();
const {User} = require('../../../db/User_schema');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const secret=require("../../secret");
const salt=7;

router.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    const user=await User.findOne({email});

    if(!user) return res.status(400).json({msg:"User not found",isLoggedin:false});
    
    const isMatch=await bcrypt.compare(password,user.password);
    
    if(!isMatch) return res.status(400).json({msg:"Invalid password", isLoggedin:false});
    
    const token=jwt.sign({id:user.id,email:user.email,name:user.name},secret,{expiresIn:3600});
    
    res.json({msg:"User logged in successfully",isLoggedin:true, user:user,token:token});
});


router.post("/register",async(req,res)=>{
    const {name,phn_no, email, password} = req.body;
    const salted=await bcrypt.genSalt(salt);
    const hashed=await bcrypt.hash(password,salted);
    try{
    const user=new User({name,phn_no,email,password:hashed});
    await user.save();
    return res.json({msg:"User registered successfully",isRegistered:true});
    }catch(err){
        console.error(err.message);
        res.status(500).json({msg:"Server error",isRegistered:false});
    }
});

module.exports = router;