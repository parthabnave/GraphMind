import React, { useEffect, useRef, useState } from "react";
import * as joint from "jointjs";

const UMLDiagram = ({ umlData }) => {
  const graphRef = useRef(null);
  const paperRef = useRef(null);
  const inputRef = useRef(null);
  const [renamedElements, setRenamedElements] = useState(() => {
    const saved = localStorage.getItem("umlRenamedElements");
    return saved ? JSON.parse(saved) : {};
  });
  const [elementPositions, setElementPositions] = useState(() => {
    const saved = localStorage.getItem("umlElementPositions");
    return saved ? JSON.parse(saved) : { position_actors: {}, position_usecases: {} };
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [originalNameMap, setOriginalNameMap] = useState({});
  const [zoom, setZoom] = useState(1);
  // Add a ref to track positions to avoid excessive state updates
  const positionsRef = useRef({ position_actors: {}, position_usecases: {} });

  // Initialize the ref with current state
  useEffect(() => {
    positionsRef.current = elementPositions;
  }, []);

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
      width: 1500,
      height: 900,
      gridSize: 10,
      interactive: { linkMove: true, elementMove: true },
      background: { color: "white" },
    });
    
    paper.scale(zoom, zoom);

    joint.shapes.custom = {};

    // Define custom shapes
    joint.shapes.custom.Actor = joint.dia.Element.extend({
      markup: [
        '<g class="rotatable">',
        '<g class="scalable">',
        '<circle class="head" cx="10" cy="10" r="10"/>',
        '<line class="body" x1="10" y1="20" x2="10" y2="40"/>',
        '<line class="arms" x1="0" y1="25" x2="20" y2="25"/>',
        '<line class="leg-left" x1="10" y1="40" x2="0" y2="60"/>',
        '<line class="leg-right" x1="10" y1="40" x2="20" y2="60"/>',
        "</g>",
        '<text class="label"/>',
        "</g>",
      ].join(""),
      defaults: joint.util.deepSupplement(
        {
          type: "custom.Actor",
          size: { width: 80, height: 110 },
          attrs: {
            ".head": { fill: "#ffffa0", stroke: "black", "stroke-width": 2 },
            ".body, .arms, .leg-left, .leg-right": { stroke: "black", "stroke-width": 2 },
            ".label": {
              "text-anchor": "middle",
              "ref-x": 0.5,
              "ref-y": 1.2,
              ref: "g",
              "y-alignment": "middle",
              fill: "black",
              fontSize: 16,
              fontWeight: "bold",
              textVerticalAnchor: "middle",
            },
          },
        },
        joint.dia.Element.prototype.defaults
      ),
    });

    joint.shapes.custom.UseCase = joint.dia.Element.extend({
      markup: [
        '<g class="rotatable">',
        '<g class="scalable">',
        '<ellipse class="body"/>',
        '</g>',
        '<text class="label"/>',
        '</g>'
      ].join(''),
      defaults: joint.util.deepSupplement(
        {
          type: "custom.UseCase",
          size: { width: 250, height: 100 },
          attrs: {
            ".body": {
              fill: "#AED6F1",
              stroke: "#3498DB",
              "stroke-width": 0,
              cx: 0.5,
              cy: 0.5,
              rx: 0.5,
              ry: 0.5
            },
            ".label": {
              "text-anchor": "middle",
              "ref-x": 0.5,
              "ref-y": 0.5,
              ref: ".body",
              fill: "black",
              fontSize: 16,
              fontWeight: "normal",
              textVerticalAnchor: "middle",
              textWrap: {
                width: -40,
                height: -40,
                ellipsis: true
              }
            }
          }
        },
        joint.dia.Element.prototype.defaults
      )
    });

    const elementsList = umlData?.[0]?.elements?.[0]?.elements || [];
    if (elementsList.length === 0) {
      console.warn("No elements found in UML data.");
      return;
    }

    const actors = new Set();
    const useCases = new Set();

    elementsList.forEach((relation) => {
      actors.add(relation.left);
      useCases.add(relation.right);
    });

    const numUseCases = useCases.size;
    const useCaseHeight = 100;
    const useCaseSpacing = 40;
    const topBottomPadding = 100;
    const requiredHeight = numUseCases * useCaseHeight + (numUseCases - 1) * useCaseSpacing + topBottomPadding;
    const cardWidth = 800;
    const cardHeight = Math.max(650, requiredHeight);

    const systemName = umlData?.[0]?.name || "Student Management System";

    const systemBoundary = new joint.shapes.standard.Rectangle({
      position: { x: 300, y: 100 },
      size: { width: cardWidth, height: cardHeight },
      attrs: {
        body: {
          fill: "white",
          stroke: "black",
          "stroke-width": 2,
          rx: 8,
          ry: 8,
          opacity: 0.8,
        },
        label: {
          text: systemName,
          fill: "black",
          fontSize: 20,
          fontWeight: "bold",
          "ref-x": 0.5,
          "ref-y": 30,
          "text-anchor": "middle",
        },
      },
    });
    graph.addCell(systemBoundary);

    const elementsMap = {};
    const newOriginalNameMap = {};
    // Create a new positions object to collect all initial positions
    const newPositions = { 
      position_actors: { ...positionsRef.current.position_actors }, 
      position_usecases: { ...positionsRef.current.position_usecases } 
    };

    const actorStartPositions = {
      left: { x: 130, y: 220 },
      right: { x: cardWidth + 380, y: 220 },
    };

    let actorCount = 0;
    const totalActors = actors.size;
    const actorSpacing = cardHeight / (totalActors + 1);

    actors.forEach((actorName) => {
      const displayName = renamedElements[actorName] || actorName;
      const isLeftActor = actorCount < totalActors / 2;

      // Use stored position if available, otherwise calculate new position
      const position = newPositions.position_actors[actorName] || {
        x: isLeftActor ? actorStartPositions.left.x : actorStartPositions.right.x,
        y: 150 + actorSpacing * (actorCount + 1),
      };

      const actor = new joint.shapes.custom.Actor({
        position: position,
        attrs: { ".label": { text: displayName } },
      });

      graph.addCell(actor);
      elementsMap[displayName] = actor;
      newOriginalNameMap[actor.id] = actorName;

      // Store initial position in newPositions
      newPositions.position_actors[actorName] = position;

      actorCount++;
    });

    const useCaseWidth = 250;
    const useCaseX = 300 + (cardWidth - useCaseWidth) / 2;
    let useCaseY = 150;

    let useCaseIndex = 0;
    useCases.forEach((useCaseName) => {
      const displayName = renamedElements[useCaseName] || useCaseName;

      // Use stored position if available, otherwise calculate new position
      const position = newPositions.position_usecases[useCaseName] || {
        x: useCaseX,
        y: useCaseY,
      };

      const useCase = new joint.shapes.custom.UseCase({
        position: position,
        size: { width: useCaseWidth, height: useCaseHeight },
        attrs: {
          ".label": { text: displayName }
        }
      });

      graph.addCell(useCase);
      elementsMap[displayName] = useCase;
      newOriginalNameMap[useCase.id] = useCaseName;

      // Store initial position in newPositions
      newPositions.position_usecases[useCaseName] = position;

      useCaseY += useCaseHeight + useCaseSpacing;
      useCaseIndex++;
    });

    // Update ref and state only once with all initial positions
    positionsRef.current = newPositions;
    // Only update state if needed
    if (JSON.stringify(newPositions) !== JSON.stringify(elementPositions)) {
      setElementPositions(newPositions);
    }

    const getArrowStyle = (body) => {
      if (body === "--") return "5,5"; // Dashed line
      if (body === "===") return "3,3"; // Dotted (Double Dashed line)
      return "none"; // Solid line
    };
    
    elementsList.forEach((relation) => {
      const leftName = renamedElements[relation.left] || relation.left;
      const rightName = renamedElements[relation.right] || relation.right;
    
      if (elementsMap[leftName] && elementsMap[rightName]) {
        const link = new joint.shapes.standard.Link({
          source: { id: elementsMap[leftName].id },
          target: { id: elementsMap[rightName].id },
          attrs: {
            line: {
              stroke: "black",
              "stroke-width": 2,
              strokeDasharray: getArrowStyle(relation.leftArrowBody + relation.rightArrowBody),
              targetMarker: relation.rightArrowHead === ">" ? { type: "path", d: "M 12 -6 L 0 0 L 12 6 Z" } : {},
            },
          },
        });
    
        graph.addCell(link);
      }
    });
    
    // Optimize rendering performance
    paper.options.async = true;
    paper.options.restrictTranslate = true;
    paper.unfreeze();

    setOriginalNameMap(newOriginalNameMap);

    // Save current state to local storage
    // This is called once during initialization, not continuously during position changes
    updateLocalStorage(umlData, newPositions, renamedElements);

    // Debounce function for position updates
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func.apply(null, args);
        }, delay);
      };
    };

    // Position update handler (doesn't set state for each change)
    const handlePositionChange = debounce((element, newPosition) => {
      const originalName = newOriginalNameMap[element.id];
      if (originalName) {
        const currentPositions = { ...positionsRef.current };
        
        // Update the position based on whether it's an actor or use case
        if (actors.has(originalName)) {
          currentPositions.position_actors[originalName] = newPosition;
        } else if (useCases.has(originalName)) {
          currentPositions.position_usecases[originalName] = newPosition;
        }

        // Update the ref without triggering state updates
        positionsRef.current = currentPositions;
        
        // Save to localStorage occasionally but don't update state
        updateLocalStorage(umlData, currentPositions, renamedElements);
      }
    }, 100);

    // Save positions in batch at a lower frequency to avoid too many state updates
    const savePositionsToState = debounce(() => {
      setElementPositions({...positionsRef.current});
    }, 1000);

    graph.on("change:position", (element, newPosition) => {
      handlePositionChange(element, newPosition);
      savePositionsToState();
    });

    paper.on("element:pointerclick", (elementView) => {
      const element = elementView.model;
      setSelectedElement(element);

      // Get the current label text based on element type
      const currentText = element.attr(".label/text") || "";
      setElementName(currentText);

      const { x, y } = element.position();
      const { width, height } = element.size();

      let inputX = x + width / 2;
      let inputY = element.get("type") === "custom.Actor" ? y + height + 15 : y + height / 2;

      setInputPosition({ x: inputX * zoom, y: inputY * zoom });

      setTimeout(() => inputRef.current?.focus(), 0);
    });

    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          const newZoom = Math.min(2, zoom + 0.1);
          setZoom(newZoom);
          paper.scale(newZoom, newZoom);
        } else if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          const newZoom = Math.max(0.5, zoom - 0.1);
          setZoom(newZoom);
          paper.scale(newZoom, newZoom);
        } else if (e.key === "0") {
          e.preventDefault();
          setZoom(1);
          paper.scale(1, 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      graph.off("change:position"); // Clean up event listener
    };
  }, [umlData, renamedElements, zoom]); // Removed elementPositions from dependency array

  // Separate effect to persist renamed elements
  useEffect(() => {
    localStorage.setItem("umlRenamedElements", JSON.stringify(renamedElements));
  }, [renamedElements]);

  // Separate effect to persist element positions
  useEffect(() => {
    localStorage.setItem("umlElementPositions", JSON.stringify(elementPositions));
  }, [elementPositions]);

  const handleNameChange = (e) => setElementName(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && selectedElement) {
      const originalName = originalNameMap[selectedElement.id];
      if (originalName) {
        selectedElement.attr(".label/text", elementName);
        const newRenamedElements = { ...renamedElements, [originalName]: elementName };
        setRenamedElements(newRenamedElements);
        updateLocalStorage(umlData, positionsRef.current, newRenamedElements);
      }
      setSelectedElement(null);
    }
  };

  const resetPositions = () => {
    localStorage.removeItem("umlElementPositions");
    localStorage.removeItem("umlRenamedElements");
    setElementPositions({ position_actors: {}, position_usecases: {} });
    positionsRef.current = { position_actors: {}, position_usecases: {} };
    setRenamedElements({});
    window.location.reload();
  };

  const updateLocalStorage = (umlData, positions, renamed) => {
    if (!umlData || !umlData[0] || !umlData[0].elements || !umlData[0].elements[0] || !umlData[0].elements[0].elements) {
      console.error("Invalid UML data structure");
      return;
    }
    
    const dataToStore = [];

    // Iterate through the original UML data to create the structure
    umlData[0].elements[0].elements.forEach((relation) => {
      const baseData = {
        left: relation.left,
        right: relation.right,
        leftType: "Unknown", // Adjust as needed
        rightType: "UseCase", // Adjust as needed
        leftArrowHead: relation.leftArrowHead,
        rightArrowHead: relation.rightArrowHead,
        leftArrowBody: relation.leftArrowBody,
        rightArrowBody: relation.rightArrowBody,
        leftCardinality: "", // Adjust as needed
        rightCardinality: "", // Adjust as needed
        label: "", // Adjust as needed
        hidden: false // Adjust as needed
      };

      // Create ChangedData based on renamed elements
      const changedData = [{
        left: renamed[relation.left] || relation.left,
        right: renamed[relation.right] || relation.right,
        leftType: "Unknown", // Adjust as needed
        rightType: "UseCase", // Adjust as needed
        leftArrowHead: "", // Adjust as needed
        rightArrowHead: ">", // Adjust as needed
        leftArrowBody: "-", // Adjust as needed
        rightArrowBody: "-", // Adjust as needed
        position_actor: positions.position_actors[relation.left] || { x: 0, y: 0 }, // Store the position for actors
        position_usecase: positions.position_usecases[relation.right] || { x: 0, y: 0 } // Store the position for use cases
      }];

      dataToStore.push({ BaseData: baseData, ChangedData: changedData });
    });

    try {
      localStorage.setItem("umlData", JSON.stringify(dataToStore));
      // Add console log as requested
      console.log("Updated localStorage with UML data:", dataToStore);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "10px", margin: "10px 20px", alignItems: "center" }}>
        <button
          onClick={resetPositions}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Reset Diagram
        </button>
        <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
          <span style={{ fontWeight: "bold" }}>Zoom: {Math.round(zoom * 100)}%</span>
          <span style={{ marginLeft: "10px", fontSize: "12px", color: "#666" }}>
            (Use Ctrl+Plus/Minus to zoom)
          </span>
        </div>
      </div>
      <div
        ref={paperRef}
        style={{
          border: "1px solid black",
          margin: "0 20px 20px 20px",
          width: "100%",
          height: "700px",
          background: "white",
          overflow: "auto",
        }}
      />
      {selectedElement && (
        <input
          ref={inputRef}
          type="text"
          value={elementName || ""}  // Ensure the value is never undefined
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          style={{
            position: "absolute",
            left: `${inputPosition.x}px`,  // Add px unit
            top: `${inputPosition.y}px`,   // Add px unit
            width: "150px", 
            transform: "translate(-50%, -50%)",
            zIndex: 999,
            padding: "4px",
            fontSize: "14px",
            border: "2px solid #3498DB",
            borderRadius: "4px",
          }}
        />
      )}
    </div>
  );
};

export default UMLDiagram;