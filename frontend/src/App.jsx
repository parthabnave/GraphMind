import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UseCaseDiagram from '../components/functional_uml';
import "./App.css"
import Home from "./home";
import Dash from "./dashboard";
import Login from "./AuthCard";

const App = () => {
    const umlData = [
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Customer",
                    "right": "Browse Books",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 130,
                        "y": 496.6666666666667
                    },
                    "position_usecase": {
                        "x": 410,
                        "y": 140
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Customer",
                    "right": "Add to Cart",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 130,
                        "y": 496.6666666666667
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 290
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Customer",
                    "right": "Checkout",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 130,
                        "y": 496.6666666666667
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 430
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Customer",
                    "right": "Make Payment",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 130,
                        "y": 496.6666666666667
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 570
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Customer",
                    "right": "Track Order",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 130,
                        "y": 496.6666666666667
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 710
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            "ChangedData": [
                {
                    "left": "Admin",
                    "right": "Manage Inventory",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 1180,
                        "y": 843.3333333333334
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 850
                    }
                }
            ]
        },
        {
            "BaseData": {
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
            },
            "ChangedData": [
                {
                    "left": "Admin",
                    "right": "Process Orders",
                    "leftType": "Unknown",
                    "rightType": "UseCase",
                    "leftArrowHead": "",
                    "rightArrowHead": ">",
                    "leftArrowBody": "-",
                    "rightArrowBody": "-",
                    "position_actor": {
                        "x": 1180,
                        "y": 843.3333333333334
                    },
                    "position_usecase": {
                        "x": 575,
                        "y": 990
                    }
                }
            ]
        }
    ];

    return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dash" element={<Dash/>} />
          </Routes>
      </Router>
      // <Login/>
        // <div>
        //     <h1>UML Diagram</h1>`
        //     <UseCaseDiagram umlData={umlData} />
        // </div>
    );
};

export default App;