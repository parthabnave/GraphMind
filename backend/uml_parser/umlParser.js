const { parse } = require('plantuml-parser');
const router = require('express').Router();

const plantUMLCode = `
@startuml
actor Customer
actor Admin

rectangle "Online Bookstore System" {
    Customer --> (Browse Books)
    Customer --> (Add to Cart)
    Customer --> (Checkout)
    Customer --> (Make Payment)
    Customer --> (Track Order)
    Admin --> (Manage Inventory)
    Admin --> (Process Orders)
}

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