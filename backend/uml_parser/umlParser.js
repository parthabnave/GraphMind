const { parse } = require('plantuml-parser');
const router = require('express').Router();

const plantUMLCode = `
@startuml
interface Coffee {
    +getDescription(): String
    +cost(): double
}

class BasicCoffee {
    +getDescription(): String
    +cost(): double
}

class MilkDecorator {
    -coffee: Coffee
    +MilkDecorator(Coffee)
    +getDescription(): String
    +cost(): double
}

Coffee <|.. BasicCoffee : <<implements>>
Coffee <|.. MilkDecorator  : <<implements>>
@enduml
`;
router.get("/",(req,res)=>{
    try {
    
        const parsedData = parse(plantUMLCode);
        return res.send(JSON.stringify(parsedData, null, 2));
    } catch (error) {
        res.json({"error":error.message});
    }
});

module.exports = router;