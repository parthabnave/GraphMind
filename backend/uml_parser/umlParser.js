const { parse } = require('plantuml-parser');
const axios = require('axios');
const router = require('express').Router();

router.post("/", async (req, res) => {
    try {
        const prom = req.body.prompt; 

        const getData = await axios.post('https://graph-mind-api.onrender.com/generate_plantuml', 
            { prompt: prom }, 
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const plantUMLCode = getData.data;
        // console.log(plantUMLCode);
        const requiredData=plantUMLCode.plantuml_code;
        const parsedData = parse(requiredData);
        // console.log("parsedData",parsedData);
        return res.json(parsedData);
    } catch (error) {
        return res.json({ "error": error.message });
    }
});

module.exports = router;
