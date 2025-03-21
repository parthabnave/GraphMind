const mongoose = require("mongoose");
const { Diagram } = require("../../../db/User_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { diagram_id, dataRelation, dataEntity } = req.body;

    if (!diagram_id || !mongoose.Types.ObjectId.isValid(diagram_id)) {
      return res.status(400).json({ msg: "Invalid or missing Diagram ID" });
    }

    const diagram = await Diagram.findById(diagram_id);
    if (!diagram) {
      return res.status(404).json({ msg: "No diagram found" });
    }

    // Update data and timestamp
    diagram.entities = dataEntity;
    diagram.relationships = dataRelation;
    diagram.updatedAt = new Date();

    await diagram.save();

    console.log("Diagram updated successfully:", diagram_id);
    return res.json({ moveOn: true });

  } catch (error) {
    console.error("Error in setdata:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
