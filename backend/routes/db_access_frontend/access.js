const { Diagram } = require("../../../db/User_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        if (!req.body.diagram_id) {
            return res.status(400).json({ error: "diagram_id is required" });
        }

        const diagram_id = req.body.diagram_id;
        console.log("Searching for diagram with ID:", diagram_id);

        const diagram = await Diagram.findById(diagram_id);

        if (!diagram) {
            return res.status(404).json({ msg: "No diagram found" });
        }

        return res.json({ moveOn: true, diagram });
    } catch (error) {
        console.error("Error in getdata:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
