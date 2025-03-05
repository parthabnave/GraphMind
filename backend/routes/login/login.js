const router = require('express').Router();
const User = require('../../../db/User_schema');
const bcrypt = require('bcrypt');
const salt=7;

router.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    const user=User.findOne({email});

    if(!user) return res.status(400).json({msg:"User not found"});
    
    const isMatch=await bcrypt.compare(password,user.password);
    
    if(!isMatch) return res.status(400).json({msg:"Invalid password"});
    
    res.json({msg:"User logged in successfully", user:user});
})


router.post("/register",async(req,res)=>{
    const {name,phn_no, email, password} = req.body;
    const salted=await bcrypt.genSalt(salt);
    const hashed=await bcrypt.hash(password,salted);
    
    const user=new User({name,phn_no,email,password:hashed});
    user.save((err,res)=>{
        if(err) return res.status(400).json({msg:err.message});
        res.json({msg:"User registered successfully", user:user});
    })
})

module.exports = router;