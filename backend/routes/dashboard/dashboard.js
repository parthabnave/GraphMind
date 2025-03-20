const router = require('express').Router();
const UserVerification = require('../../middlewares/user_login');
const { UMLModel } = require("../../../db/User_schema");

router.get('/', UserVerification, async (req, res) => {
    try {
        console.log("User  ID:", req.user.id); // Log the user ID for debugging
        let history = await UMLModel.find({ user_id: req.user.id });
        console.log("Fetched history:", history);
        let nameWithHistory={history,name:req.user.name};
        res.json(nameWithHistory);
    } catch (error) {
        console.error("Error fetching diagrams:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;