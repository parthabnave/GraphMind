const jwt = require('jsonwebtoken');
const secret=require("../secret");

function UserVerification(req,res,next)
{
    const token=req.header('token').split(' ')[1];
    const decoded=jwt.verify(token,secret);
    if(!decoded) return res.status(401).json({msg:"Token is not valid"});
    req.user=decoded;
    next();
}
module.exports=UserVerification;