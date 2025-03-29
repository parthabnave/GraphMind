const router = require('express').Router();
const UserVerification = require('../../middlewares/user_login');
const { Diagram } = require("../../../db/User_schema");

router.get('/', UserVerification, async (req, res) => {
    try {
        // console.log("User ID:", req.user.id);
        // console.log("Collection name:", Diagram.collection.name);
        // const user_id=req.user.id;

        let history = await Diagram.find({});
        // console.log("Fetched history:", history);
        let nameWithHistory={history,name:req.user.name};
        res.json(nameWithHistory);
    } catch (error) {
        console.error("Error fetching diagrams:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;