import React, { useEffect, useRef } from 'react'; // ✅ Import useEffect & useRef
import './App.css';
import Home from './home';
import Dashboard from './dashboard';
import Dashcard from '../components/DashboardCard';
import LoginBoard from './AuthCard';
import * as joint from 'jointjs';

const App = () => {
  const paperRef = useRef(null);

  useEffect(() => {
    if (!paperRef.current) return; // ✅ Ensure ref exists before using it

    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: 800,
      height: 500,
      gridSize: 10,
    });

    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 100);
    rect.resize(100, 50);
    rect.attr({
      body: { fill: 'lightblue' },
      label: { text: 'JointJS', fill: 'black' },
    });
    rect.addTo(graph);
  }, []);

  return <div ref={paperRef} style={{ width: '800px', height: '500px', border: '1px solid #ccc', marginTop: '20px' }} />;
};

export default App;
