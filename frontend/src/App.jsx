import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import blueTheme from './themes/blueTheme';
import "./App.css"
import Home from "./pages/home";
import Dash from "./pages/dashboard";
import Login from "./pages/AuthCard";
import UseCaseDiagram from "./components/UseCaseDiagram";

const App = () => {
  return (
    <ThemeProvider theme={blueTheme}>
      <CssBaseline />
      <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dash/>} />
          <Route path="/UseCaseEditor" element={<UseCaseDiagram />} />

          </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
