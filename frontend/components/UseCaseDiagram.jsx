import React, { useEffect, useRef, useState } from "react";
import * as joint from "jointjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

function convertToDiagramJson(inputData) {
  const elements = inputData[0].elements;
  const systemBoundary = elements[0];
  const useCases = systemBoundary.elements;
  const useCaseNames = new Set(useCases.map(uc => uc.title));
  const relationships = elements.slice(1);

  const useCaseNameToTitle = Object.fromEntries(useCases.map(uc => [uc.name, uc.title]));
  const actorNames = new Set();
  for (const rel of relationships) {
    if (!useCaseNames.has(rel.left)) actorNames.add(rel.left);
  }
  const actors = Array.from(actorNames);

  const actorEntities = actors.map((actor, index) => ({
    identifier: actor,
    type: "actor",
    position: { x: 50, y: 100 + index * 100 },
    size: { width: 50, height: 80 },
    label: actor
  }));

  const useCaseEntities = useCases.map((uc, index) => ({
    identifier: useCaseNameToTitle[uc.name],
    type: "useCase",
    position: { x: 200, y: 100 + index * 80 },
    size: { width: 120, height: 60 },
    label: useCaseNameToTitle[uc.name]
  }));

  const relationshipsOutput = relationships.map(rel => ({
    source: rel.left,
    target: useCaseNameToTitle[rel.right] || rel.right,
    type: rel.label?.toLowerCase().includes("include") ? "include" : "association"
  }));

  return { entities: [...actorEntities, ...useCaseEntities], relationships: relationshipsOutput };
}

const UseCaseDiagram = ({ data }) => {
  const paperRef = useRef(null);
  const graphRef = useRef(null);
  const systemRef = useRef(null);
  const tempSourceRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [responseAI, setResponseAI] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLink, setSelectedLink] = useState(null);
  const [relationshipType, setRelationshipType] = useState("");
  const [isDrawingLink, setIsDrawingLink] = useState(false);
  const [sourceElement, setSourceElement] = useState(null);
  const [toolbarMode, setToolbarMode] = useState(null);
  const [nextActorId, setNextActorId] = useState(1);
  const [serverResponse, setServerResponse] = useState(null);
  const [nextUseCaseId, setNextUseCaseId] = useState(1);
  const [projectName, setProjectName] = useState(localStorage.getItem("projectName") || "Project Name");
  const [environmentName, setEnvironmentName] = useState(localStorage.getItem("environmentName") || "System");
  const [tempEnvironmentName, setTempEnvironmentName] = useState(environmentName);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [isEditingEnvironmentName, setIsEditingEnvironmentName] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const isDrawingLinkRef = useRef(isDrawingLink);

  useEffect(() => {
    isDrawingLinkRef.current = isDrawingLink;
  }, [isDrawingLink]);

  const handleServerResponse = (data) => {
    setServerResponse(data);
    setResponseAI(true);
  };

  useEffect(() => {
    if (serverResponse) {
      const data = convertToDiagramJson(serverResponse);
      localStorage.setItem("useCaseElements", JSON.stringify(data.entities));
      localStorage.setItem("useCaseLinks", JSON.stringify(data.relationships));
    }
  }, [serverResponse]);

  useEffect(() => {
    if (responseAI) {
      const updatedElements = JSON.parse(localStorage.getItem("useCaseElements")) || [];
      const updatedLinks = JSON.parse(localStorage.getItem("useCaseLinks")) || [];
      renderDiagram(updatedElements, updatedLinks);
      setResponseAI(false);
    }
  }, [responseAI]);

  const renderDiagram = (elementsData, linksData) => {
    if (!graphRef.current) return;

    graphRef.current.clear();
    const elements = {};
    const UMLActor = createStickFigureShape();

    elementsData.forEach(entity => {
      if (entity.type === "actor") {
        const actor = new UMLActor();
        actor.position(entity.position.x, entity.position.y);
        actor.resize(entity.size.width, entity.size.height);
        actor.attr({ label: { text: entity.label, refY: -15 } });
        actor.prop("identifier", entity.identifier);
        actor.prop("type", "actor");
        actor.addTo(graphRef.current);
        elements[entity.identifier] = actor;
      } else if (entity.type === "useCase") {
        const ellipse = new joint.shapes.standard.Ellipse();
        ellipse.position(entity.position.x, entity.position.y);
        ellipse.resize(entity.size.width, entity.size.height);
        ellipse.attr({
          body: { fill: "#d1ecf1", stroke: "#000", strokeWidth: 1.5 },
          label: { text: entity.label, fill: "#000", fontSize: 16 },
        });
        ellipse.prop("identifier", entity.identifier);
        ellipse.prop("type", "useCase");
        ellipse.addTo(graphRef.current);
        elements[entity.identifier] = ellipse;
      }
    });

    linksData.forEach(link => {
      const sourceElement = elements[link.source];
      const targetElement = elements[link.target];
      if (sourceElement && targetElement) {
        const connection = new joint.shapes.standard.Link();
        connection.source(sourceElement);
        connection.target(targetElement);
        connection.prop("relationshipType", link.type);
        connection.attr({
          line: {
            stroke: '#000',
            strokeWidth: 1.5,
            strokeDasharray: (link.type === "include" || link.type === "extends") ? "5 5" : "0",
            targetMarker: { type: "path", d: "M 10 -5 L 0 0 L 10 5", fill: '#000' }
          },
          labels: link.type === "include" ? [{
            position: 0.5,
            attrs: { text: { text: '<<include>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
          }] : link.type === "extends" ? [{
            position: 0.5,
            attrs: { text: { text: '<<extends>>', fill: '#000', fontSize: 12, fontStyle: 'italic' }, rect: { fill: 'white', stroke: 'none' } }
          }] : []
        });
        connection.addTo(graphRef.current);
      }
    });

    const useCaseElements = graphRef.current.getElements().filter(el => el.prop('type') === 'useCase');
    const systemBoundary = calculateSystemBoundary(useCaseElements);
    const system = new joint.shapes.standard.Rectangle();
    system.position(systemBoundary.x, systemBoundary.y);
    system.resize(systemBoundary.width, systemBoundary.height);
    system.attr({
      body: { fill: "#f8f9fa", stroke: "#000", strokeWidth: 2 },
      label: { text: tempEnvironmentName, fill: "#000", fontSize: 18, fontWeight: 'bold', textAnchor: 'middle', textVerticalAnchor: 'top', refY: 15, fontFamily: 'Poppins' },
    });
    system.addTo(graphRef.current);
    system.toBack();
    systemRef.current = system;
  };

  const saveGraphState = () => {
    if (!graphRef.current) return;

    const elements = graphRef.current.getElements().map(el => ({
      identifier: el.prop('identifier'),
      type: el.prop('type'),
      position: el.position(),
      size: el.size(),
      label: el.attr('label/text')
    }));

    const links = graphRef.current.getLinks().map(link => ({
      source: link.getSourceElement()?.prop('identifier'),
      target: link.getTargetElement()?.prop('identifier'),
      type: link.prop('relationshipType') || 'association'
    }));

    localStorage.setItem("useCaseElements", JSON.stringify(elements));
    localStorage.setItem("useCaseLinks", JSON.stringify(links));
    setResponseAI(true);
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

  const calculateSystemBoundary = (useCaseElements) => {
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

  const updateSystemBoundary = () => {
    if (!graphRef.current || !systemRef.current) return;
    const useCaseElements = graphRef.current.getElements().filter(el => el.prop('type') === 'useCase');
    const systemBoundary = calculateSystemBoundary(useCaseElements);
    systemRef.current.position(systemBoundary.x, systemBoundary.y);
    systemRef.current.resize(systemBoundary.width, systemBoundary.height);
    systemRef.current.attr({ label: { text: tempEnvironmentName } });
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

    const savedElements = JSON.parse(localStorage.getItem("useCaseElements")) || [];
    const savedLinks = JSON.parse(localStorage.getItem("useCaseLinks")) || [];
    if (savedElements.length > 0) {
      renderDiagram(savedElements, savedLinks);
    } else {
      renderDiagram(data.entities, data.relationships);
    }

    paper.on("element:pointerdown", handleElementClick);
    paper.on("element:pointerdblclick", (elementView) => {
      const element = elementView.model;
      if (element === systemRef.current) {
        setIsEditingEnvironmentName(true);
        setInputValue(tempEnvironmentName);
        setSelectedElement(null);
      } else {
        setSelectedElement(element);
        setIsEditingEnvironmentName(false);
        const currentText = element.prop('type') === 'actor' ? element.attr('label/text') : element.attr("label/text");
        setInputValue(currentText);
      }
    });

    paper.on("link:pointerclick", (linkView) => {
      setSelectedLink(linkView.model);
      setSelectedElement(null);
      setIsEditingEnvironmentName(false);
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
      setIsEditingEnvironmentName(false);
      setInputValue("");
    });

    paper.on("element:pointermove", (elementView) => {
      if (elementView.model.prop('type') === 'useCase') {
        updateSystemBoundary();
      }
    });

    paper.on("element:pointerup", (elementView) => {
      if (elementView.model.prop('type') === 'useCase') {
        updateSystemBoundary();
      }
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
  }, []);

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
        attrs: { text: { text: '<<include>>', fill: '#000', fontSize: 12, fontStyle: 'italic', fontFamily: 'Poppins' }, rect: { fill: 'white', stroke: 'none' } }
      }] : type === "extends" ? [{
        position: 0.5,
        attrs: { text: { text: '<<extends>>', fill: '#000', fontSize: 12, fontStyle: 'italic', fontFamily: 'Poppins' }, rect: { fill: 'white', stroke: 'none' } }
      }] : []
    });
    setSelectedLink(null);
  };

  const handleRename = (e) => {
    if (e.key === "Enter") {
      if (selectedElement) {
        if (selectedElement.prop('type') === 'actor') {
          selectedElement.attr('label/text', inputValue);
        } else {
          selectedElement.attr("label/text", inputValue);
        }
        setInputValue("");
        setSelectedElement(null);
        updateSystemBoundary();
      } else if (isEditingEnvironmentName) {
        setTempEnvironmentName(inputValue);
        setInputValue("");
        setIsEditingEnvironmentName(false);
        updateSystemBoundary();
      }
    }
  };

  const handleProjectNameChange = (e) => {
    if (e.key === "Enter") {
      setProjectName(e.target.value);
      setIsEditingProjectName(false);
    }
  };

  const addActor = () => {
    if (!graphRef.current) return;
    const UMLActor = createStickFigureShape();
    const actorId = `actor${nextActorId}`;
    const newActor = new UMLActor();
    newActor.position(400, 300);
    newActor.resize(120, 120);
    newActor.attr({ label: { text: `Actor ${nextActorId}`, refY: -15, fontFamily: 'Poppins' } });
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
      label: { text: `New Use Case ${nextUseCaseId}`, fill: "#000", fontSize: 16, fontFamily: 'Poppins' },
    });
    newUseCase.prop('identifier', useCaseId);
    newUseCase.prop('type', 'useCase');
    newUseCase.addTo(graphRef.current);
    setNextUseCaseId(nextUseCaseId + 1);
    updateSystemBoundary();
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
      setInputValue("");
      updateSystemBoundary();
    } else if (selectedLink) {
      selectedLink.remove();
      setSelectedLink(null);
    }
  };

  const exportToPDF = () => {
    html2canvas(paperRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'px', [1500, 900]);
      pdf.addImage(imgData, 'PNG', 0, 0, 1500, 900);
      pdf.save(`${projectName}.pdf`);
    });
    setShowExportDropdown(false);
  };

  const exportToPNG = () => {
    html2canvas(paperRef.current).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${projectName}.png`;
      link.click();
    });
    setShowExportDropdown(false);
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
        width: "220px",
        height: "900px",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #dee2e6",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.05)",
        position: "relative"
      }}>
        <div 
          onDoubleClick={() => setIsEditingProjectName(true)}
          style={{ 
            textAlign: "center", 
            margin: "0 0 15px 0", 
            fontSize: "16px",
            color: "#333",
            fontWeight: "600",
            fontFamily: 'Poppins, sans-serif',
            cursor: "pointer"
          }}
        >
          {isEditingProjectName ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={handleProjectNameChange}
              onBlur={() => setIsEditingProjectName(false)}
              style={{
                padding: "5px",
                border: "2px solid #007bff",
                borderRadius: "4px",
                backgroundColor: "white",
                width: "100%",
                textAlign: "center",
                fontSize: "16px",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "600",
                outline: "none"
              }}
              autoFocus
            />
          ) : (
            projectName
          )}
        </div>
        
        <button
          onClick={() => { setToolbarMode('actor'); addActor(); }}
          style={{ 
            padding: "12px 8px", 
            background: toolbarMode === 'actor' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'actor' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif',
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <svg 
            width="40" 
            height="50" 
            viewBox="-20 -25 40 60" 
            style={{ margin: "0 auto" }}
          >
            <path 
              d="M 0 -15 m 0 -9 a 9 9 0 1 0 0.1 0 Z M 0 -15 L 0 15 M -15 0 L 15 0 M -12 35 L 0 15 L 12 35" 
              stroke="#000" 
              strokeWidth="2.5" 
              fill="none" 
            />
          </svg>
          <span>Actor</span>
        </button>
        
        <button
          onClick={() => { setToolbarMode('useCase'); addUseCase(); }}
          style={{ 
            padding: "12px 8px", 
            background: toolbarMode === 'useCase' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'useCase' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif',
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ width: "50px", height: "30px", border: "2px solid #000", borderRadius: "50%", margin: "0 auto", backgroundColor: "#d1ecf1" }}></div>
          <span>Use Case</span>
        </button>
        
        <button
          onClick={startConnection}
          style={{ 
            padding: "12px 8px", 
            background: toolbarMode === 'link' ? '#007bff' : '#ffffff', 
            color: toolbarMode === 'link' ? 'white' : '#333', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif',
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ width: "50px", height: "30px", position: "relative", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: "14px", left: "0", width: "50px", height: "2px", backgroundColor: "#000" }}></div>
            <div style={{ position: "absolute", top: "9px", right: "0", width: "10px", height: "10px", borderTop: "2px solid #000", borderRight: "2px solid #000", transform: "rotate(45deg)" }}></div>
          </div>
          <span>Connect</span>
        </button>

        {(selectedElement || isEditingEnvironmentName) && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleRename}
            placeholder={selectedElement ? "Enter new name" : "Enter environment name"}
            style={{
              padding: "10px",
              border: "2px solid #007bff",
              borderRadius: "4px",
              backgroundColor: "white",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              fontSize: "13px",
              fontFamily: 'Poppins, sans-serif'
            }}
            autoFocus
          />
        )}
        
        <button
          onClick={saveGraphState}
          style={{ 
            padding: "12px 8px", 
            background: '#28a745', 
            color: 'white', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif',
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <span>Save</span>
        </button>
        
        <button
          onClick={deleteElement}
          style={{ 
            padding: "12px 8px", 
            background: '#dc3545', 
            color: 'white', 
            border: "1px solid #dee2e6", 
            borderRadius: "6px", 
            cursor: "pointer", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif',
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <span>Delete</span>
        </button>
        <Chatbox onResponse={(data) => handleServerResponse(data)} />
      </div>

      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: "10"
      }}>
        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: 'Poppins, sans-serif',
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease"
          }}
        >
          Export
        </button>
        {showExportDropdown && (
          <div style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "5px",
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            width: "100px"
          }}>
            <button
              onClick={exportToPDF}
              style={{
                padding: "8px",
                background: "white",
                color: "#333",
                border: "none",
                borderBottom: "1px solid #dee2e6",
                cursor: "pointer",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "500",
                textAlign: "left",
                transition: "background 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f3f5'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              PDF
            </button>
            <button
              onClick={exportToPNG}
              style={{
                padding: "8px",
                background: "white",
                color: "#333",
                border: "none",
                cursor: "pointer",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "500",
                textAlign: "left",
                transition: "background 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f3f5'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              PNG
            </button>
          </div>
        )}
      </div>

      {selectedLink && (
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          zIndex: "10",
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
            fontWeight: "500",
            fontFamily: 'Poppins, sans-serif'
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
                transition: "all 0.2s ease",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "500"
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
                transition: "all 0.2s ease",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "500"
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
                transition: "all 0.2s ease",
                fontFamily: 'Poppins, sans-serif',
                fontWeight: "500"
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
              transition: "all 0.2s ease",
              fontFamily: 'Poppins, sans-serif',
              fontWeight: "500"
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
          zIndex: "10",
          padding: "10px 20px",
          backgroundColor: "rgba(0, 123, 255, 0.95)",
          color: "white",
          borderRadius: "6px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: 'Poppins, sans-serif'
        }}>
          {sourceElement ? "Click target element to connect" : "Click source element to start"}
        </div>
      )}
    </div>
  );
};

export default UseCaseDiagram;