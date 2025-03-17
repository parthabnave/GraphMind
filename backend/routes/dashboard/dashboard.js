const router=require('express').Router();
const UserVerification=require('../../middlewares/user_login');
const {Diagram}=require("../../../db/User_schema");


router.get('/', UserVerification, async(req, res) => {
    let history=await Diagram.find({user_id:req.user.id});
    res.json(history);
});

module.exports=router;