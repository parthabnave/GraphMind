// function convertPlantUMLToDiagram(plantUMLData) {
//     // Extract use cases from the PlantUML data
//     const useCases = plantUMLData[0].elements[0].elements;
  
//     // Define base positions and sizes
//     const useCaseWidth = 250;
//     const useCaseHeight = 60;
//     const actorWidth = 120;
//     const actorHeight = 120;
//     const baseX = 700;
//     const baseY = 150;
//     const ySpacing = 100;
  
//     // Convert use cases from PlantUML data
//     const entities = useCases.map((useCase, index) => ({
//       identifier: useCase.name,
//       type: "useCase",
//       position: {
//         x: baseX,
//         y: baseY + index * ySpacing,
//       },
//       size: {
//         width: useCaseWidth,
//         height: useCaseHeight,
//       },
//       label: useCase.title,
//     }));
  
//     // Additional predefined use cases (UC1-UC8)
//     const additionalUseCases = [
//       { identifier: "UC1", label: "Make Reservation", y: 150 },
//       { identifier: "UC2", label: "Order Food", y: 250 },
//       { identifier: "UC3", label: "Pay Bill", y: 350 },
//       { identifier: "UC4", label: "Manage Menu", y: 450 },
//       { identifier: "UC5", label: "Manage Staff", y: 550 },
//       { identifier: "UC6", label: "Prepare Food", y: 650 },
//       { identifier: "UC7", label: "Serve Food", y: 750 },
//       { identifier: "UC8", label: "Generate Reports", y: 850 },
//     ];
  
//     additionalUseCases.forEach((uc) => {
//       entities.push({
//         identifier: uc.identifier,
//         type: "useCase",
//         position: {
//           x: baseX,
//           y: uc.y,
//         },
//         size: {
//           width: useCaseWidth,
//           height: useCaseHeight,
//         },
//         label: uc.label,
//       });
//     });
  
//     // Add actors
//     const actors = [
//       { identifier: "Customer", label: "Customer", x: 150, y: 200 },
//       { identifier: "Manager", label: "Manager", x: 150, y: 650 },
//       { identifier: "Chef", label: "Chef", x: 150, y: 1100 },
//       { identifier: "Waiter", label: "Waiter", x: 150, y: 1250 },
//     ];
  
//     actors.forEach((actor) => {
//       entities.push({
//         identifier: actor.identifier,
//         type: "actor",
//         position: {
//           x: actor.x,
//           y: actor.y,
//         },
//         size: {
//           width: actorWidth,
//           height: actorHeight,
//         },
//         label: actor.label,
//       });
//     });
  
//     // Define relationships
//     const relationships = [
//       { source: "Customer", target: "UC1", relationshipType: "association" },
//       { source: "Customer", target: "UC2", relationshipType: "association" },
//       { source: "Customer", target: "UC3", relationshipType: "association" },
//       { source: "Manager", target: "UC4", relationshipType: "association" },
//       { source: "Manager", target: "UC5", relationshipType: "association" },
//       { source: "UC2", target: "UC6", relationshipType: "includes" },
//       { source: "UC2", target: "UC7", relationshipType: "includes" },
//       { source: "Manager", target: "UC5", relationshipType: "association" },
//       { source: "Waiter", target: "UC2", relationshipType: "association" },
//       { source: "Waiter", target: "UC3", relationshipType: "association" },
//       { source: "Manager", target: "UC8", relationshipType: "association" },
//       { source: "Chef", target: "UC6", relationshipType: "association" },
//       { source: "Waiter", target: "UC7", relationshipType: "association" },
//     ];
  
//     // Return the converted data
//     return {
//       entities,
//       relationships,
//     };
//   }
  
//   // Example usage
//   const plantUMLData = [
//     {
//       "elements": [
//         {
//           "name": "Restaurant Management System",
//           "title": "Restaurant Management System",
//           "type": "rectangle",
//           "elements": [
//             { "name": "Place Order", "title": "Place Order" },
//             { "name": "View Menu", "title": "View Menu" },
//             { "name": "Make Reservation", "title": "Make Reservation" },
//             { "name": "Process Payment", "title": "Process Payment" },
//             { "name": "Prepare Food", "title": "Prepare Food" },
//             { "name": "Manage Inventory", "title": "Manage Inventory" },
//             { "name": "Generate Reports", "title": "Generate Reports" },
//             { "name": "Manage Staff", "title": "Manage Staff" },
//           ],
//         },
//       ],
//     },
//   ];
  
//   // Convert and log the result
//   const convertedData = convertPlantUMLToDiagram(plantUMLData);
//   console.log(JSON.stringify(["entities": convertedData.entities, "relationships": convertedData.relationships], null, 2));
  
//   // Export the function
//   module.exports = { convertPlantUMLToDiagram }; // For Node.js
//   // export default convertPlantUMLToDiagram; // For ES6 modules