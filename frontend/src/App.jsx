import React from "react";
import UseCaseDiagram from "../components/UseCaseDiagram";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./home";
import Dash from "./dashboard";
import Login from "./AuthCard";
// import Chatbox from "../components/chatbot";
const App = () => {


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