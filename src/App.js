import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';

export default function App() {
  const [nodes, setNodes] = useState([]);
  
  // Create a new node (and a new Notion Page) on double click
  const onDoubleClick = async (event) => {
    const newNode = {
      id: Math.random().toString(),
      position: { x: event.clientX, y: event.clientY },
      data: { label: 'New Page' },
    };
    
    setNodes((nds) => nds.concat(newNode));
    
    // Tell Notion to create this page in the background
    await fetch('/api/create-page', { 
        method: 'POST', 
        body: JSON.stringify(newNode) 
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} 
        onPaneDoubleClick={onDoubleClick}
        onNodeClick={(e, node) => window.open(`https://notion.so/${node.id.replace(/-/g, '')}`)}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}