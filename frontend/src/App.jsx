import React from "react";
import UseCaseDiagram from "../components/UseCaseDiagram";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./home";
import Dash from "./dashboard";
import Login from "./AuthCard";
// import Chatbox from "../components/chatbot";

function convertToDiagramJson(inputData) {
  const elements = inputData[0].elements;
  const systemBoundary = elements[0];
  const useCases = systemBoundary.elements;
  const useCaseNames = new Set(useCases.map(uc => uc.title));
  const relationships = elements.slice(1);

  // Create a lookup for use case names to titles
  const useCaseNameToTitle = Object.fromEntries(useCases.map(uc => [uc.name, uc.title]));

  // Identify actors
  const actorNames = new Set();
  for (const rel of relationships) {
    if (!useCaseNames.has(rel.left)) actorNames.add(rel.left);
  }
  const actors = Array.from(actorNames);

  // Create actor entities
  const actorEntities = actors.map((actor, index) => ({
    identifier: actor,
    type: "actor",
    position: { x: 50, y: 100 + index * 100 },
    size: { width: 50, height: 80 },
    label: actor
  }));

  // Create use case entities using lookup
  const useCaseEntities = useCases.map((uc, index) => ({
    identifier: useCaseNameToTitle[uc.name],
    type: "useCase",
    position: { x: 200, y: 100 + index * 80 },
    size: { width: 120, height: 60 },
    label: useCaseNameToTitle[uc.name]
  }));

  // Map relationships using the lookup
  const relationshipsOutput = relationships.map(rel => ({
    source: rel.left,
    target: useCaseNameToTitle[rel.right] || rel.right, // Use lookup or fallback to original
    type: rel.label?.toLowerCase().includes("include") ? "include" : "association"
  }));

  return { entities: [...actorEntities, ...useCaseEntities], relationships: relationshipsOutput };
}

const App = () => {
  const data=[{"elements":[{"name":"Hospital","title":"Hospital","type":"rectangle","elements":[{"name":"RegisterPatient","title":"Register as Patient"},{"name":"ScheduleAppointment","title":"Schedule Appointment"},{"name":"CheckIn","title":"Check In"},{"name":"ConsultDoctor","title":"Consult with Doctor"},{"name":"ReceiveTreatment","title":"Receive Treatment"},{"name":"AdministerMedication","title":"Administer Medication"},{"name":"DischargePatient","title":"Discharge Patient"},{"name":"GenerateBill","title":"Generate Bill"},{"name":"ProcessPayment","title":"Process Payment"},{"name":"ViewMedicalRecord","title":"View Medical Record"}]},{"left":"Patient","right":"RegisterPatient","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"ScheduleAppointment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"CheckIn","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"ConsultDoctor","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"ReceiveTreatment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"DischargePatient","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Patient","right":"ProcessPayment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Doctor","right":"ConsultDoctor","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Doctor","right":"ReceiveTreatment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Doctor","right":"ViewMedicalRecord","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Nurse","right":"ReceiveTreatment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Nurse","right":"AdministerMedication","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Nurse","right":"ViewMedicalRecord","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Nurse","right":"DischargePatient","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Receptionist","right":"RegisterPatient","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Receptionist","right":"ScheduleAppointment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"Receptionist","right":"CheckIn","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"BillingClerk","right":"GenerateBill","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"BillingClerk","right":"ProcessPayment","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false},{"left":"BillingClerk","right":"ViewMedicalRecord","leftType":"Unknown","rightType":"Unknown","leftArrowHead":"","rightArrowHead":"","leftArrowBody":"-","rightArrowBody":"-","leftCardinality":"","rightCardinality":"","label":"","hidden":false}]}];
  
  console.log(convertToDiagramJson(data));
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash" element={<Dash/>} />
        <Route path="/UseCaseEditor" element={<UseCaseDiagram />} />

        </Routes>
    </Router>
  );
};

export default App;