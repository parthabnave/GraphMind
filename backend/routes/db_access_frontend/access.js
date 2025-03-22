const { Diagram } = require("../../../db/User_schema");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        if (!req.body.diagram_id) {
            return res.status(400).json({ error: "diagram_id is required" });
        }

        const diagram_id = req.body.diagram_id;
        

        // const diagramId = 'your_diagram_id_here';

const diagram = await Diagram.findById(diagram_id)
  .lean()
  .select('title description createdAt updatedAt entities relationships')
  .exec();

const formattedData = {
  title: diagram.title,
  description: diagram.description,
  createdAt: diagram.createdAt,
  updatedAt: diagram.updatedAt,
  entities: diagram.entities.map(entity => ({
    identifier: entity.identifier,
    type: entity.type,
    position: {
      x: entity.position.x,
      y: entity.position.y,
    },
    size: {
      width: entity.size.width,
      height: entity.size.height,
    },
    label: entity.label,
  })),
  relationships: diagram.relationships.map(relationship => ({
    source: relationship.source,
    target: relationship.target,
    relationshipType: relationship.relationshipType,
  })),
};

console.log(formattedData);




        if (!diagram) {
            return res.status(404).json({ msg: "No diagram found" });
        }
        // console.log(diagram);
        return res.json({ moveOn: true, formattedData });
    } catch (error) {
        console.error("Error in getdata:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
