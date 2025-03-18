import React, { useEffect, useRef } from 'react'; // ✅ Import useEffect & useRef
import './App.css';
import Home from './home';
import Dashboard from './dashboard';
import Dashcard from '../components/DashboardCard';
import LoginBoard from './AuthCard';
import * as joint from 'jointjs';

const App = () => {
  const paperRef = useRef(null);
  const umlData = [
    {
      elements: [
        {
          name: "Online Bookstore System",
          title: "Online Bookstore System",
          type: "rectangle",
          elements: [
            { left: "Customer", right: "Browse Books", rightType: "UseCase" },
            { left: "Customer", right: "Add to Cart", rightType: "UseCase" },
            { left: "Customer", right: "Checkout", rightType: "UseCase" },
            { left: "Customer", right: "Make Payment", rightType: "UseCase" },
            { left: "Customer", right: "Track Order", rightType: "UseCase" },
            { left: "Admin", right: "Manage Inventory", rightType: "UseCase" },
            { left: "Admin", right: "Process Orders", rightType: "UseCase" },
          ],
        },
      ],
    },
  ];

  return(
    <div className="App">
      <h2 style={{ textAlign: "center" }}>UML Diagram</h2>
      <UMLDiagram umlData={umlData} />
    </div>
  )
};

export default App;
