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
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [originalNameMap, setOriginalNameMap] = useState({});
  const [zoom, setZoom] = useState(1);

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

    // Keep original actor structure
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

    // Modified UseCase shape - removed outer ellipse
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

      const position =
        elementPositions[actorName] || {
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
      actorCount++;
    });

    const useCaseWidth = 250;
    const useCaseX = 300 + (cardWidth - useCaseWidth) / 2;
    let useCaseY = 150;

    let useCaseIndex = 0;
    useCases.forEach((useCaseName) => {
      const displayName = renamedElements[useCaseName] || useCaseName;

      const position =
        elementPositions[useCaseName] || {
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

      useCaseY += useCaseHeight + useCaseSpacing;
      useCaseIndex++;
    });

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
              targetMarker: {
                type: "path",
                d: "M 12 -6 L 0 0 L 12 6 Z",
              },
            },
          },
        });
        graph.addCell(link);
      }
    });

    setOriginalNameMap(newOriginalNameMap);

    graph.on("change:position", (element, newPosition) => {
      const originalName = newOriginalNameMap[element.id];
      if (originalName) {
        const newPositions = { ...elementPositions };
        newPositions[originalName] = newPosition;
        setElementPositions(newPositions);
        localStorage.setItem("umlElementPositions", JSON.stringify(newPositions));
      }
    });

    paper.on("element:pointerclick", (elementView) => {
      const element = elementView.model;
      setSelectedElement(element);

      let currentText =
        element.get("type") === "custom.Actor" ? element.attr(".label/text") : element.attr(".label/text");

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

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [umlData, renamedElements, elementPositions, zoom]);

  useEffect(() => {
    localStorage.setItem("umlRenamedElements", JSON.stringify(renamedElements));
  }, [renamedElements]);

  const handleNameChange = (e) => setElementName(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && selectedElement) {
      const originalName = originalNameMap[selectedElement.id];
      if (originalName) {
        selectedElement.attr(".label/text", elementName);
        setRenamedElements((prev) => ({ ...prev, [originalName]: elementName }));
      }
      setSelectedElement(null);
    }
  };

  const resetPositions = () => {
    localStorage.removeItem("umlElementPositions");
    localStorage.removeItem("umlRenamedElements");
    setElementPositions({});
    setRenamedElements({});
    window.location.reload();
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
          value={elementName}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          style={{
            position: "absolute",
            left: inputPosition.x,
            top: inputPosition.y,
            width: "150px", // Adjusted width
            transform: "translate(-50%, -50%)",
            zIndex: 999,
            padding: "4px", // Adjusted padding
            fontSize: "14px", // Adjusted font size
            border: "2px solid #3498DB",
            borderRadius: "4px",
          }}
        />
      )}
    </div>
  );
};

export default UMLDiagram;