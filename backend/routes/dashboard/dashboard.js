const router=require('express').Router();
const {UserVerification}=require('../../middlewares/user_login');

router.get('/user', {UserVerification}, (req, res) => {
    return res.json({name: req.user.name, email: req.user.email, phn_no: req.user.phn_no  });
});

module.exports=router;