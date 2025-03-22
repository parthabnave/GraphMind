import React, { useEffect, useRef, useState } from "react";
import * as joint from "jointjs";
import Chatbox from "./chatbot";
const createStickFigureShape = () => {
  return joint.dia.Element.define('uml.Actor', {
    attrs: {
      root: { cursor: 'pointer' },
      body: { refWidth: '100%', refHeight: '100%', fill: 'transparent', stroke: 'none' },
      label: { textVerticalAnchor: 'bottom', textAnchor: 'middle', refX: '50%', refY: -15, fontSize: 16, fontWeight: 'normal', fill: '#000' },
      stickFigure: { refX: '50%', refY: '40%', d: 'M 0 -15 m 0 -9 a 9 9 0 1 0 0.1 0 Z M 0 -15 L 0 15 M -15 0 L 15 0 M -12 35 L 0 15 L 12 35', stroke: '#000', strokeWidth: 2.5, fill: 'none' }
    }
  }, {
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'path', selector: 'stickFigure' },
      { tagName: 'text', selector: 'label' }
    ]
  });
};

const UseCaseDiagram = ({ data }) => {
  const paperRef = useRef(null);
  const graphRef = useRef(null);
  const systemRef = useRef(null);

  const tempSourceRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [selectedLink, setSelectedLink] = useState(null);
  const [relationshipType, setRelationshipType] = useState("");
  const [isDrawingLink, setIsDrawingLink] = useState(false);
  const [sourceElement, setSourceElement] = useState(null);
  const [toolbarMode, setToolbarMode] = useState(null);
  const [nextActorId, setNextActorId] = useState(1);
  const [serverResponse, setServerResponse] = useState(null);
  const [nextUseCaseId, setNextUseCaseId] = useState(1);
  const isDrawingLinkRef = useRef(isDrawingLink);

  useEffect(() => {
    isDrawingLinkRef.current = isDrawingLink;
  }, [isDrawingLink]);

  const saveGraphState = () => {
    if (!graphRef.current) return;

    const elements = graphRef.current.getElements()
      .map(el => ({
        identifier: el.prop('identifier'),
        type: el.prop('type'),
        position: el.position(),
        size: el.size(),
        label: el.prop('type') === 'actor' ? el.attr('label/text') : el.attr('label/text')
      }))
      .filter(el => el.identifier);

    localStorage.setItem("useCaseElements", JSON.stringify(elements));

    const links = graphRef.current.getLinks().map(link => ({
      source: link.getSourceElement()?.prop('identifier'),
      target: link.getTargetElement()?.prop('identifier'),
      relationshipType: link.prop('relationshipType') || 'association'
    }));

    localStorage.setItem("useCaseLinks", JSON.stringify(links));
  };

  const handleElementClick = (elementView, evt) => {
    evt.stopPropagation();
    const element = elementView.model;

    if (isDrawingLinkRef.current) {
      if (!tempSourceRef.current) {
        tempSourceRef.current = element;
        setSourceElement(element);
      } else if (tempSourceRef.current.id !== element.id) {
        const link = new joint.shapes.standard.Link({
          source: { id: tempSourceRef.current.id },
          target: { id: element.id },
          attrs: {
            line: {
              stroke: '#000',
              strokeWidth: 1.5,
              targetMarker: { type: 'path', d: 'M 10 -5 L 0 0 L 10 5', fill: '#000' }
            }
          },
          relationshipType: 'association'
        });
        link.addTo(graphRef.current);
        tempSourceRef.current = null;
        setIsDrawingLink(false);
        setSourceElement(null);
        setToolbarMode(null);
      }
    } else {
      setSelectedElement(element);
      setSelectedLink(null);
    }
  };

  useEffect(() => {
    if (!paperRef.current) return;

    const UMLActor = createStickFigureShape();
    const graph = new joint.dia.Graph();
    graphRef.current = graph;

    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: 1500,
      height: 900,
      gridSize: 1,
      interactive: { linkMove: true, labelMove: true, elementMove: true, vertexAdd: true },
      background: { color: '#f8f9fa' },
    });
    // localStorage.removeItem("useCaseLinks");
    // localStorage.removeItem("useCaseElements");
    const savedElements = JSON.parse(localStorage.getItem("useCaseElements")) || [];
    const savedLinks = JSON.parse(localStorage.getItem("useCaseLinks")) || [];
    const elements = {};
    const useCaseElements = [];
    console.log("SetServsrResponse: ",serverResponse);

    const createActor = (identifier, position, size, label) => {
      const actor = new UMLActor();
      actor.position(position.x, position.y);
      actor.resize(size.width, size.height);
      actor.attr({ label: { text: label, refY: -15 } });
      actor.prop('identifier', identifier);
      actor.prop('type', 'actor');
      actor.addTo(graph);
      elements[identifier] = actor;
    };

    const createUseCase = (identifier, position, size, label) => {
      const ellipse = new joint.shapes.standard.Ellipse();
      ellipse.position(position.x, position.y);
      ellipse.resize(size.width, size.height);
      ellipse.attr({
        body: { fill: "#d1ecf1", stroke: "#000", strokeWidth: 1.5 },
        label: { text: label, fill: "#000", fontSize: 16 },
      });
      ellipse.prop('identifier', identifier);
      ellipse.prop('type', 'useCase');
      ellipse.addTo(graph);
      elements[identifier] = ellipse;
      useCaseElements.push(ellipse);
    };

    if (savedElements.length > 0) {
      savedElements.forEach(savedEl => {
        if (savedEl.type === 'actor') {
          createActor(savedEl.identifier, savedEl.position, savedEl.size, savedEl.label);
          const match = savedEl.identifier.match(/actor(\d+)/);
          if (match && parseInt(match[1]) >= nextActorId) setNextActorId(parseInt(match[1]) + 1);
        } else if (savedEl.type === 'useCase') {
          createUseCase(savedEl.identifier, savedEl.position, savedEl.size, savedEl.label);
          const match = savedEl.identifier.match(/useCase(\d+)/);
          if (match && parseInt(match[1]) >= nextUseCaseId) setNextUseCaseId(parseInt(match[1]) + 1);
        }
      });

      savedLinks.forEach(({ source, target, relationshipType }) => {
        const sourceElement = elements[source];
        const targetElement = elements[target];
        if (sourceElement && targetElement) {
          const link = new joint.shapes.standard.Link();
          link.source(sourceElement);
          link.target(targetElement);
          link.prop('relationshipType', relationshipType);
          link.attr({
            line: {
              stroke: '#000',
              strokeWidth: 1.5,
              strokeDasharray: (relationshipType === "includes" || relationshipType === "extends") ? "5 5" : "0",
              targetMarker: { type: "path", d: "M 10 -5 L 0 0 L 10 5", fill: '#000' }
            },
            labels: relationshipType === "includes" ? [{
              position: 0.5,
              attrs: { text: { text: '<<include>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
            }] : relationshipType === "extends" ? [{
              position: 0.5,
              attrs: { text: { text: '<<extends>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
            }] : []
          });
          link.addTo(graph);
        }
      });
    } else {
      data.entities.forEach(entity => {
        if (entity.type === 'actor') {
          createActor(entity.identifier, entity.position, entity.size, entity.label);
        } else if (entity.type === 'useCase') {
          createUseCase(entity.identifier, entity.position, entity.size, entity.label);
        }
      });

      data.relationships.forEach(rel => {
        const sourceElement = elements[rel.source];
        const targetElement = elements[rel.target];
        if (sourceElement && targetElement) {
          const link = new joint.shapes.standard.Link();
          link.source(sourceElement);
          link.target(targetElement);
          link.prop('relationshipType', rel.relationshipType);
          link.attr({
            line: {
              stroke: '#000',
              strokeWidth: 1.5,
              strokeDasharray: (rel.relationshipType === "includes" || rel.relationshipType === "extends") ? "5 5" : "0",
              targetMarker: { type: "path", d: "M 10 -5 L 0 0 L 10 5", fill: '#000' }
            },
            labels: rel.relationshipType === "includes" ? [{
              position: 0.5,
              attrs: { text: { text: '<<include>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
            }] : rel.relationshipType === "extends" ? [{
              position: 0.5,
              attrs: { text: { text: '<<extends>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
            }] : []
          });
          link.addTo(graph);
        }
      });
    }

    const calculateSystemBoundary = () => {
      if (useCaseElements.length === 0) return { x: 500, y: 100, width: 500, height: 450 };
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      useCaseElements.forEach(element => {
        const position = element.position();
        const size = element.size();
        minX = Math.min(minX, position.x - 30);
        minY = Math.min(minY, position.y - 30);
        maxX = Math.max(maxX, position.x + size.width + 30);
        maxY = Math.max(maxY, position.y + size.height + 30);
      });
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };

    const systemBoundary = calculateSystemBoundary();
    const system = new joint.shapes.standard.Rectangle();
    system.position(systemBoundary.x, systemBoundary.y);
    system.resize(systemBoundary.width, systemBoundary.height);
    const diagram_name=localStorage.getItem("projectName");
    system.attr({
      body: { fill: "#f8f9fa", stroke: "#000", strokeWidth: 2 },
      label: { text: diagram_name, fill: "#000", fontSize: 18, fontWeight: 'bold', textAnchor: 'middle', textVerticalAnchor: 'top', refY: 15 },
    });
    system.addTo(graph);
    system.toBack();
    systemRef.current = system;

    paper.on("element:pointerdown", handleElementClick);
    paper.on("element:pointerdblclick", (elementView) => {
      const element = elementView.model;
      setSelectedElement(element);
      const currentText = element.prop('type') === 'actor' ? element.attr('label/text') : element.attr("label/text");
      setInputValue(currentText);
      setInputPosition({ x: element.position().x + element.size().width / 2, y: element.position().y - 30 });
    
    });

    paper.on("link:pointerclick", (linkView) => {
      setSelectedLink(linkView.model);
      setSelectedElement(null);
      setRelationshipType(linkView.model.prop('relationshipType') || 'association');
    });

    paper.on("blank:pointerclick", () => {
      if (isDrawingLink) {
        tempSourceRef.current = null;
        setIsDrawingLink(false);
        setSourceElement(null);
        setToolbarMode(null);
      }
      setSelectedElement(null);
      setSelectedLink(null);
    });

    let isPanning = false;
    let lastX, lastY;

    paper.on('blank:pointerdown', (evt) => {
      isPanning = true;
      lastX = evt.clientX;
      lastY = evt.clientY;
      document.body.style.cursor = 'grabbing';
    });

    const handleMouseMove = (evt) => {
      if (isPanning) {
        const dx = evt.clientX - lastX;
        const dy = evt.clientY - lastY;
        const currentPan = paper.translate();
        paper.translate(currentPan.tx + dx, currentPan.ty + dy);
        lastX = evt.clientX;
        lastY = evt.clientY;
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
      }
      isPanning = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    const handleWheel = (evt) => {
      evt.preventDefault();
      const currentScale = paper.scale().sx;
      const newScale = evt.deltaY < 0 ? Math.min(currentScale + 0.1, 2) : Math.max(currentScale - 0.1, 0.5);
      paper.scale(newScale, newScale);
    };

    paperRef.current.addEventListener('wheel', handleWheel);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (paperRef.current) paperRef.current.removeEventListener('wheel', handleWheel);
    };
  }, [data]);

  const changeRelationshipType = (type) => {
    if (!selectedLink) return;
    selectedLink.prop('relationshipType', type);
    selectedLink.attr({
      line: {
        strokeDasharray: type === "includes" || type === "extends" ? "5 5" : "0",
        stroke: "#000",
        strokeWidth: 1.5,
        targetMarker: { type: "path", d: "M 10 -5 L 0 0 L 10 5", fill: '#000' }
      },
      labels: type === "includes" ? [{
        position: 0.5,
        attrs: { text: { text: '<<include>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
      }] : type === "extends" ? [{
        position: 0.5,
        attrs: { text: { text: '<<extends>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
      }] : []
    });
    setSelectedLink(null);
  };

  const handleRename = (e) => {
    if (e.key === "Enter" && selectedElement) {
      if (selectedElement.prop('type') === 'actor') {
        selectedElement.attr('label/text', inputValue);
      } else {
        selectedElement.attr("label/text", inputValue);
      }
      setSelectedElement(null);
    }
  };

  const addActor = () => {
    if (!graphRef.current) return;
    const UMLActor = createStickFigureShape();
    const actorId = `actor${nextActorId}`;
    const newActor = new UMLActor();
    newActor.position(400, 300);
    newActor.resize(120, 120);
    newActor.attr({ label: { text: `Actor ${nextActorId}`, refY: -15 } });
    newActor.prop('identifier', actorId);
    newActor.prop('type', 'actor');
    newActor.addTo(graphRef.current);
    setNextActorId(nextActorId + 1);
  };

  const addUseCase = () => {
    if (!graphRef.current) return;
    const useCaseId = `useCase${nextUseCaseId}`;
    const newUseCase = new joint.shapes.standard.Ellipse();
    newUseCase.position(600, 300);
    newUseCase.resize(250, 60);
    newUseCase.attr({
      body: { fill: "#d1ecf1", stroke: "#000", strokeWidth: 1.5 },
      label: { text:` New Use Case ${nextUseCaseId}`, fill: "#000", fontSize: 16 },
    });
    newUseCase.prop('identifier', useCaseId);
    newUseCase.prop('type', 'useCase');
    newUseCase.addTo(graphRef.current);
    setNextUseCaseId(nextUseCaseId + 1);
    updateSystemBoundary();

  };
  const updateSystemBoundary = () => {
    const systemBoundary = calculateSystemBoundary();
    if (systemRef.current) {
      systemRef.current.position(systemBoundary.x, systemBoundary.y);
      systemRef.current.resize(systemBoundary.width, systemBoundary.height);
    }
  };
  
  
  const startConnection = () => {
    setIsDrawingLink(true);
    setSourceElement(null);
    setToolbarMode('link');
  };

  const deleteElement = () => {
    if (selectedElement) {
      const connectedLinks = graphRef.current.getConnectedLinks(selectedElement);
      connectedLinks.forEach(link => link.remove());
      selectedElement.remove();
      setSelectedElement(null);
      updateSystemBoundary();
    } else if (selectedLink) {
      selectedLink.remove();
      setSelectedLink(null);
    }
  };

  const handleServerResponse = (data) => {
    console.log("Data received in parent:", data);
    // Perform actions with the data
  };

  return (
    <div style={{ 
      position: "relative", 
      display: "flex", 
      flexDirection: "row-reverse",
      width: "1500px",
      height: "900px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      <div
        ref={paperRef}
        style={{
          flex: 1,
          border: "1px solid #dee2e6",
          borderRadius: "8px 0 0 8px",
          backgroundColor: "white",
          overflow: "hidden"
        }}
      ></div>

      <div style={{
        width: "120px",
        height: "900px",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #dee2e6",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.05)"
      }}>
        <h3 style={{ 
          textAlign: "center", 
          margin: "0 0 10px 0", 
          fontSize: "16px",
          color: "#333",
          fontWeight: "600"
        }}>Tools</h3>
        
        <button
          onClick={() => { setToolbarMode('actor'); addActor(); }}
          style={{ 
            padding: "10px 5px", 
            background: toolbarMode === 'actor' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'actor' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "6px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ width: "30px", height: "40px", position: "relative", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: "0", left: "12px", width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #000" }}></div>
            <div style={{ position: "absolute", top: "12px", left: "14px", width: "2px", height: "15px", backgroundColor: "#000" }}></div>
            <div style={{ position: "absolute", top: "18px", left: "5px", width: "20px", height: "2px", backgroundColor: "#000" }}></div>
            <div style={{ position: "absolute", top: "27px", left: "8px", width: "8px", height: "2px", backgroundColor: "#000", transform: "rotate(45deg)" }}></div>
            <div style={{ position: "absolute", top: "27px", left: "14px", width: "8px", height: "2px", backgroundColor: "#000", transform: "rotate(-45deg)" }}></div>
          </div>
          <span>Actor</span>
        </button>
        
        <button
          onClick={() => { setToolbarMode('useCase'); addUseCase(); }}
          style={{ 
            padding: "10px 5px", 
            background: toolbarMode === 'useCase' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'useCase' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "6px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ width: "40px", height: "25px", border: "2px solid #000", borderRadius: "50%", margin: "0 auto", backgroundColor: "#d1ecf1" }}></div>
          <span>Use Case</span>
        </button>
        
        <button
          onClick={startConnection}
          style={{ 
            padding: "10px 5px", 
            background: toolbarMode === 'link' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'link' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "6px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ width: "40px", height: "25px", position: "relative", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: "12px", left: "0", width: "40px", height: "2px", backgroundColor: "#000" }}></div>
            <div style={{ position: "absolute", top: "8px", right: "0", width: "8px", height: "8px", borderTop: "2px solid #000", borderRight: "2px solid #000", transform: "rotate(45deg)" }}></div>
          </div>
          <span>Connect</span>
        </button>
        
        <button
          onClick={saveGraphState}
          style={{ 
            padding: "10px 5px", 
            background: '#28a745', 
            color: 'white', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "6px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <span>Save</span>
        </button>
        
        <button
          onClick={deleteElement}
          style={{ 
            padding: "10px 5px", 
            background: '#dc3545', 
            color: 'white', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "6px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease",
            marginTop: "1/2"
          }}
        >
          <div style={{ width: "25px", height: "25px", position: "relative", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: "0", left: "11px", width: "3px", height: "25px", backgroundColor: "#fff", transform: "rotate(45deg)" }}></div>
            <div style={{ position: "absolute", top: "0", left: "11px", width: "3px", height: "25px", backgroundColor: "#fff", transform: "rotate(-45deg)" }}></div>
          </div>
          <span>Delete</span>
        </button>
        <Chatbox onResponse={(data) => setServerResponse(data)} />
      </div>

      {selectedElement && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleRename}
          style={{
            position: "absolute",
            left: inputPosition.x,
            top: inputPosition.y,
            zIndex: 10,
            padding: "8px",
            border: "2px solid #007bff",
            borderRadius: "4px",
            backgroundColor: "white",
            width: "250px",
            textAlign: "center",
            transform: "translateX(-50%)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            fontSize: "14px"
          }}
          autoFocus
        />
      )}

      {selectedLink && (
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "15px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <h3 style={{ 
            margin: "0 0 10px 0", 
            textAlign: "center",
            color: "#333",
            fontSize: "16px",
            fontWeight: "500"
          }}>Set Relationship Type:</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => changeRelationshipType('association')} 
              style={{ 
                padding: "8px 12px", 
                background: relationshipType === 'association' ? '#007bff' : '#ffffff', 
                color: relationshipType === 'association' ? 'white' : '#333', 
                border: "1px solid #dee2e6", 
                borderRadius: "4px", 
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease"
              }}>
              Association
            </button>
            <button 
              onClick={() => changeRelationshipType('includes')} 
              style={{ 
                padding: "8px 12px", 
                background: relationshipType === 'includes' ? '#007bff' : '#ffffff', 
                color: relationshipType === 'includes' ? 'white' : '#333', 
                border: "1px solid #dee2e6", 
                borderRadius: "4px", 
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease"
              }}>
              Include
            </button>
            <button 
              onClick={() => changeRelationshipType('extends')} 
              style={{ 
                padding: "8px 12px", 
                background: relationshipType === 'extends' ? '#007bff' : '#ffffff', 
                color: relationshipType === 'extends' ? 'white' : '#333', 
                border: "1px solid #dee2e6", 
                borderRadius: "4px", 
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease"
              }}>
              Extend
            </button>
          </div>
          <button 
            onClick={() => setSelectedLink(null)} 
            style={{ 
              padding: "8px 12px", 
              background: '#f8f9fa', 
              color: '#333', 
              border: "1px solid #dee2e6", 
              borderRadius: "4px", 
              cursor: "pointer", 
              marginTop: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease"
            }}>
            Cancel
          </button>
        </div>
      )}

      {isDrawingLink && (
        <div style={{
          position: "absolute",
          top: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: "rgba(0, 123, 255, 0.95)",
          color: "white",
          borderRadius: "6px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {sourceElement ? "Click target element to connect" : "Click source element to start"}
        </div>
      )}
    </div>
  );
};

export default UseCaseDiagram;