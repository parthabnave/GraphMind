import React, { useEffect, useRef } from 'react'; // ✅ Import useEffect & useRef
import './App.css';
import Home from './home';
import Dashboard from './dashboard';
import Dashcard from '../components/DashboardCard';
import LoginBoard from './AuthCard';
import * as joint from 'jointjs';
import UMLDiagram from '../components/UseCaseDiagram';

const App = () => {
  const paperRef = useRef(null);
  const umlData = [

      {
      "elements": [
      {
      "name": "Online Bookstore System",
      "title": "Online Bookstore System",
      "type": "rectangle",
      "elements": [
      {
      "left": "Customer",
      "right": "Browse Books",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Customer",
      "right": "Add to Cart",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Customer",
      "right": "Checkout",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Customer",
      "right": "Make Payment",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Customer",
      "right": "Track Order",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Admin",
      "right": "Manage Inventory",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      },
      {
      "left": "Admin",
      "right": "Process Orders",
      "leftType": "Unknown",
      "rightType": "UseCase",
      "leftArrowHead": "",
      "rightArrowHead": ">",
      "leftArrowBody": "-",
      "rightArrowBody": "-",
      "leftCardinality": "",
      "rightCardinality": "",
      "label": "",
      "hidden": false
      }
      ]
      }
      ]
      }
  ];

  return(
    <div className="App">
      <h2 style={{ textAlign: "center" }}>UML Diagram</h2>
      <UMLDiagram umlData={umlData} />

      </div>
  )
};

export default App;