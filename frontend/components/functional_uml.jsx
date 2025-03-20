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
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const renderDiagram = (data) => {
      if (!data || data.length === 0) {
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

      // Track unique actors
      const createdActors = new Set();

      // Generate UML diagram from JSON data
      data.forEach(item => {
        const { BaseData, ChangedData } = item;
        const { left, right } = BaseData;

        // Create Actor only if it doesn't already exist
        if (!createdActors.has(left)) {
          const actor = new joint.shapes.custom.Actor({
            position: ChangedData[0].position_actor,
            attrs: { ".label": { text: left } },
          });
          graph.addCell(actor);
          createdActors.add(left); // Add actor to the set to ensure uniqueness
        }

        // Create Use Case
        const useCase = new joint.shapes.custom.UseCase({
          position: ChangedData[0].position_usecase,
          attrs: { ".label": { text: right } },
        });
        graph.addCell(useCase);

        // Create Link
        const link = new joint.shapes.standard.Link();
        link.source(graph.getElements().find(el => el.attr(".label/text") === left));
        link.target(useCase);
        link.addTo(graph);
      });

      // Optimize rendering performance
      paper.options.async = true;
      paper.options.restrictTranslate = true;
      paper.unfreeze();

      // Handle element selection and renaming
      paper.on("element:pointerclick", (elementView) => {
        const element = elementView.model;
        setSelectedElement(element);
        const currentText = element.attr(".label/text") || "";
        setElementName(currentText);
        const { x, y } = element.position();
        const { width, height } = element.size();
        setInputPosition({ x: x + width / 2, y: y + height / 2 });
        setTimeout(() => inputRef.current?.focus(), 0);
      });

      return () => {
        graph.clear();
      };
    };

    renderDiagram(umlData); // Initial render

  }, [umlData, renamedElements]);

  const handleNameChange = (e) => setElementName(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && selectedElement) {
      const originalName = selectedElement.attr(".label/text");
      selectedElement.attr(".label/text", elementName);
      setRenamedElements((prev) => ({ ...prev, [originalName]: elementName }));
      setSelectedElement(null);
    }
  };

  const resetDiagram = () => {
    // Re-render the diagram with the original data
    renderDiagram(umlData);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={resetDiagram} style={{ marginBottom: "10px" }}>
        Reset Diagram
      </button>
      <div ref={paperRef} style={{ border: "1px solid black", width: "100%", height: "700px" }} />
      {selectedElement && (
        <input
          ref={inputRef}
          type="text"
          value={elementName}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          style={{
            position: "absolute",
            left: `${inputPosition.x}px`,
            top: `${inputPosition.y}px`,
            zIndex: 1000,
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