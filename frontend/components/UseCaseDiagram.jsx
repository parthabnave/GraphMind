import React, { useEffect, useRef, useState } from "react";
import * as joint from "jointjs";

const UMLDiagram = ({ umlData }) => {
  const graphRef = useRef(null);
  const paperRef = useRef(null);
  const inputRef = useRef(null);
  const [renamedElements, setRenamedElements] = useState(() => {
    const saved = localStorage.getItem('umlRenamedElements');
    return saved ? JSON.parse(saved) : {};
  });
  const [elementPositions, setElementPositions] = useState(() => {
    const saved = localStorage.getItem('umlElementPositions');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [originalNameMap, setOriginalNameMap] = useState({});

  useEffect(() => {
    if (!umlData || umlData.length === 0) {
      console.error("Invalid or empty UML data provided.");
      return;
    }

    const graph = new joint.dia.Graph();
    graphRef.current = graph;

    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: 800,
      height: 600,
      gridSize: 10,
      interactive: { linkMove: true, elementMove: true },
    });

    if (!paperRef.current) {
      console.error("Paper element not found.");
      return;
    }

    const elementsMap = {};
    const newOriginalNameMap = {};
    let x = 100, y = 50;

    const elementsList = umlData?.[0]?.elements?.[0]?.elements || [];
    if (elementsList.length === 0) {
      console.warn("No elements found in UML data.");
      return;
    }

    elementsList.forEach((relation) => {
      const leftName = renamedElements[relation.left] || relation.left;
      const rightName = renamedElements[relation.right] || relation.right;

      if (!elementsMap[leftName]) {
        // Check if we have a saved position for this element
        const savedPosition = elementPositions[relation.left] || { x, y };
        
        elementsMap[leftName] = new joint.shapes.standard.Rectangle({
          position: savedPosition,
          size: { width: 140, height: 60 },
          attrs: {
            body: { fill: "#2ECC71", stroke: "#27AE60", rx: 10, ry: 10 },
            label: {
              text: leftName,
              fill: "black",
              fontSize: 14,
              fontWeight: "bold",
            },
          },
        });

        graph.addCell(elementsMap[leftName]);
        // Store the original name with element id
        newOriginalNameMap[elementsMap[leftName].id] = relation.left;
        
        // Only increment default position if we didn't use a saved position
        if (!elementPositions[relation.left]) {
          y += 120;
        }
      }

      if (!elementsMap[rightName]) {
        // Check if we have a saved position for this element
        const savedPosition = elementPositions[relation.right] || { x: x + 250, y: y - 120 };
        
        elementsMap[rightName] = new joint.shapes.standard.Rectangle({
          position: savedPosition,
          size: { width: 140, height: 60 },
          attrs: {
            body: { fill: "#3498DB", stroke: "#2980B9", rx: 10, ry: 10 },
            label: {
              text: rightName,
              fill: "black",
              fontSize: 14,
              fontWeight: "bold",
            },
          },
        });

        graph.addCell(elementsMap[rightName]);
        // Store the original name with element id
        newOriginalNameMap[elementsMap[rightName].id] = relation.right;
      }

      const link = new joint.shapes.standard.Link();
      link.source(elementsMap[leftName]);
      link.target(elementsMap[rightName]);
      link.attr({
        line: { stroke: "black", strokeWidth: 2, targetMarker: { type: "classic", fill: "black" } },
      });

      graph.addCell(link);
    });

    // Update original name map
    setOriginalNameMap(newOriginalNameMap);

    // Handle element position changes
    graph.on('change:position', (element, newPosition) => {
      const originalName = newOriginalNameMap[element.id];
      if (originalName) {
        const newPositions = { ...elementPositions };
        newPositions[originalName] = newPosition;
        setElementPositions(newPositions);
        
        // Save to localStorage
        localStorage.setItem('umlElementPositions', JSON.stringify(newPositions));
      }
    });

    paper.on('element:pointerdblclick', (elementView) => {
      const element = elementView.model;
      setSelectedElement(element);
      setElementName(element.attr('label/text'));
      const { x, y } = element.position();
      const { width, height } = element.size();
      setInputPosition({ x: x + width / 2, y: y + height / 2 });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    });

  }, [umlData, renamedElements, elementPositions]);

  useEffect(() => {
    // Save renamed elements to localStorage whenever they change
    localStorage.setItem('umlRenamedElements', JSON.stringify(renamedElements));
  }, [renamedElements]);

  const handleNameChange = (e) => {
    setElementName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && selectedElement) {
      // Get the original name for this element
      const originalName = originalNameMap[selectedElement.id];
      
      if (originalName) {
        // Update the element's visual text
        selectedElement.attr('label/text', elementName);
        
        // Store the renamed mapping using the original name as key
        setRenamedElements((prev) => ({
          ...prev,
          [originalName]: elementName,
        }));
      }
      
      setSelectedElement(null); // Hide input after renaming
    }
  };

  // Add a button to reset positions
  const resetPositions = () => {
    localStorage.removeItem('umlElementPositions');
    localStorage.removeItem('umlRenamedElements');
    setElementPositions({});
    setRenamedElements({});
    // Force a re-render
    window.location.reload();
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={paperRef} style={{ border: "1px solid black", margin: "20px", width: "800px", height: "600px" }} />
      {selectedElement && (
        <input
          ref={inputRef}
          type="text"
          value={elementName}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          style={{
            position: "absolute",
            left: inputPosition.x,
            top: inputPosition.y,
            width: "140px",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <button 
        onClick={resetPositions}
        style={{
          margin: "0 20px",
          padding: "8px 16px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Reset Diagram
      </button>
    </div>
  );
};

export default UMLDiagram;