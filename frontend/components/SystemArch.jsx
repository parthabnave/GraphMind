import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import 'jointjs/dist/joint.css';

const DiagramEditor = ({ data }) => {
    const paperRef = useRef(null);
    const graphRef = useRef(new joint.dia.Graph());
    const [scale, setScale] = useState(1);
    const [editingElement, setEditingElement] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const paperInstance = useRef(null);

    useEffect(() => {
        if (!paperRef.current || !data?.elements) return;

        // Load saved positions and names from localStorage
        const savedPositions = JSON.parse(localStorage.getItem("diagramPositions")) || {};
        const savedNames = JSON.parse(localStorage.getItem("diagramNames")) || {};

        const paper = new joint.dia.Paper({
            el: paperRef.current,
            model: graphRef.current,
            width: 1000,
            height: 600,
            gridSize: 20,
            drawGrid: true,
            background: { color: 'white' },
            interactive: { elementMove: true, linkMove: true }
        });
        
        paperInstance.current = paper;

        // Enable panning (dragging the canvas)
        let isPanning = false;
        let startPosition = { x: 0, y: 0 };

        paper.on('blank:pointerdown', (event, x, y) => {
            isPanning = true;
            startPosition = { x, y };
        });

        paper.on('blank:pointermove', (event, x, y) => {
            if (isPanning) {
                const dx = x - startPosition.x;
                const dy = y - startPosition.y;
                const currentTranslate = paper.translate();
                paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
                startPosition = { x, y }; // Update start position for smoother panning
            }
        });

        paper.on('blank:pointerup', () => {
            isPanning = false;
        });

        // Clear existing graph
        graphRef.current.clear();

        const elements = {};
        const spacingX = 200;
        const spacingY = 100;
        let x = 50, y = 50;

        // Create nodes with stored positions
        data.elements.forEach((item) => {
            if (item.left && item.right) {
                if (!elements[item.left]) {
                    const pos = savedPositions[item.left] || { x, y };
                    const displayName = savedNames[item.left] || item.left;

                    elements[item.left] = new joint.shapes.standard.Rectangle();
                    elements[item.left].resize(150, 50);
                    elements[item.left].position(pos.x, pos.y);
                    elements[item.left].attr({
                        body: { fill: "#d1ecf1", stroke: "#000" },
                        label: { text: displayName, fill: "#000" },
                    });
                    elements[item.left].addTo(graphRef.current);
                    x += spacingX;
                    if (x > 800) { x = 50; y += spacingY; }
                }

                if (!elements[item.right]) {
                    const pos = savedPositions[item.right] || { x, y };
                    const displayName = savedNames[item.right] || item.right;

                    elements[item.right] = new joint.shapes.standard.Rectangle();
                    elements[item.right].resize(150, 50);
                    elements[item.right].position(pos.x, pos.y);
                    elements[item.right].attr({
                        body: { fill: "#f8d7da", stroke: "#000" },
                        label: { text: displayName, fill: "#000" },
                    });
                    elements[item.right].addTo(graphRef.current);
                    x += spacingX;
                    if (x > 800) { x = 50; y += spacingY; }
                }

                // Create link
                const link = new joint.shapes.standard.Link();
                link.source(elements[item.left]);
                link.target(elements[item.right]);

                if (item.label) {
                    link.appendLabel({
                        attrs: { text: { text: item.label, fill: "black" } },
                        position: { distance: 0.5 },
                    });
                }

                link.addTo(graphRef.current);
            }
        });

        // Save positions when elements are moved
        paper.on("element:pointerup", (elementView) => {
            const element = elementView.model;
            const position = element.position();
            const name = element.attr("label/text");

            // Update localStorage
            const updatedPositions = JSON.parse(localStorage.getItem("diagramPositions")) || {};
            updatedPositions[name] = position;
            localStorage.setItem("diagramPositions", JSON.stringify(updatedPositions));
        });

        // Enable renaming feature when clicking on element (changed from double-click)
        paper.on("element:pointerdown", (elementView) => {
            const element = elementView.model;
            const name = element.attr("label/text");
            
            // Get element position and dimensions
            const position = element.position();
            const size = element.size();
            
            // Calculate center position for the input
            const centerX = position.x + size.width/2 - 75; // Adjust width for centering
            const centerY = position.y + size.height/2 - 15; // Adjust height for centering
            
            // Convert paper coordinates to client coordinates
            const clientPosition = paper.localToClientPoint({ x: centerX, y: centerY });
            
            // Adjust for any scrolling in the container
            const containerRect = paperRef.current.getBoundingClientRect();
            const scrollLeft = paperRef.current.scrollLeft;
            const scrollTop = paperRef.current.scrollTop;
            
            setEditingElement(element);
            setInputValue(name);

            if (inputRef.current) {
                // Position input directly over the element
                inputRef.current.style.left = `${clientPosition.x}px`;
                inputRef.current.style.top = `${clientPosition.y}px`;
                inputRef.current.style.display = "block";
                inputRef.current.style.width = `${size.width - 10}px`; // Match element width
                
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    inputRef.current.focus();
                    inputRef.current.select();
                }, 10);
            }
        });

        // Handle keyboard events for zooming
        const handleKeyDown = (e) => {
            // Ctrl + + for zoom in
            if (e.ctrlKey && e.key === '+') {
                e.preventDefault();
                zoomIn();
            }
            // Ctrl + - for zoom out
            else if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                zoomOut();
            }
        };

        // Mouse wheel zooming with Ctrl key
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.1 : -0.1;
                const newScale = Math.max(0.1, Math.min(3, scale + delta));
                
                // Get mouse position relative to paper
                const rect = paperRef.current.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                
                // Update scale
                setScale(newScale);
                graphRef.current.scale(newScale, newScale, offsetX, offsetY);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        paperRef.current.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (paperRef.current) {
                paperRef.current.removeEventListener('wheel', handleWheel);
            }
        };

    }, [data, scale]);

    // Zoom Functions
    const zoomIn = () => {
        const newScale = Math.min(3, scale + 0.1);
        setScale(newScale);
        
        // Zoom towards center of viewport
        const paperEl = paperRef.current;
        const centerX = paperEl.clientWidth / 2;
        const centerY = paperEl.clientHeight / 2;
        
        graphRef.current.scale(newScale, newScale, centerX, centerY);
    };

    const zoomOut = () => {
        const newScale = Math.max(0.1, scale - 0.1);
        setScale(newScale);
        
        // Zoom from center of viewport
        const paperEl = paperRef.current;
        const centerX = paperEl.clientWidth / 2;
        const centerY = paperEl.clientHeight / 2;
        
        graphRef.current.scale(newScale, newScale, centerX, centerY);
    };

    // Handle renaming input
    const handleRename = (event) => {
        if (event.key === "Enter" && editingElement) {
            finishRenaming();
        } else if (event.key === "Escape") {
            cancelRenaming();
        }
    };
    
    const finishRenaming = () => {
        const newName = inputValue.trim();
        if (newName !== "" && editingElement) {
            // Store old name for updating localStorage references
            const oldName = editingElement.attr("label/text");
            
            // Update element with new name
            editingElement.attr("label/text", newName);

            // Update localStorage
            const savedNames = JSON.parse(localStorage.getItem("diagramNames")) || {};
            savedNames[editingElement.id] = newName;
            localStorage.setItem("diagramNames", JSON.stringify(savedNames));
            
            // Update positions reference if name changed
            if (oldName !== newName) {
                const savedPositions = JSON.parse(localStorage.getItem("diagramPositions")) || {};
                if (savedPositions[oldName]) {
                    savedPositions[newName] = savedPositions[oldName];
                    delete savedPositions[oldName];
                    localStorage.setItem("diagramPositions", JSON.stringify(savedPositions));
                }
            }
        }

        // Hide input
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
        setEditingElement(null);
    };
    
    const cancelRenaming = () => {
        if (inputRef.current) {
            inputRef.current.style.display = "none";
        }
        setEditingElement(null);
    };
    
    // Handle clicking outside to finish editing
    const handleBlur = () => {
        finishRenaming();
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={zoomIn}>Zoom In</button>
                <button onClick={zoomOut} style={{ marginLeft: "5px" }}>Zoom Out</button>
                <span style={{ marginLeft: "10px" }}>
                    <strong>Scale: {Math.round(scale * 100)}%</strong> | 
                    Press <strong>Ctrl++</strong> to zoom in, <strong>Ctrl+-</strong> to zoom out, or <strong>Ctrl+scroll</strong>
                </span>
            </div>
            <div 
                ref={paperRef} 
                style={{ 
                    width: "1000px", 
                    height: "600px", 
                    border: "1px solid black", 
                    overflow: "auto",
                    position: "relative"
                }} 
            />
            
            {/* Input Box for Renaming */}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleRename}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    display: "none",
                    zIndex: 1000,
                    padding: "5px",
                    border: "2px solid #007bff",
                    borderRadius: "4px",
                    background: "white",
                    textAlign: "center",
                    fontFamily: "inherit"
                }}
            />
        </div>
    );
};

export default DiagramEditor;