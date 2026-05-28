import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Position, Handle } from 'reactflow';
import '@xyflow/react/dist/style.css';



const NODE_WIDTH = "150"
export function CustomNode() {
  const onChange = useCallback((evt) => {
      console.log(evt.target.value);
  }, []);
  return (
    <div className="custom-node">
         <div style={{ width: NODE_WIDTH, height: '100px', backgroundColor: 'lightblue',display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 25}}>
           <input id="text" style={{ backgroundColor: 'lightblue', width: NODE_WIDTH-10, border: 'none', outline: 'none', textAlign: 'center'}} name="text" onChange={onChange} className="nodrag" />
           <Handle type="source" position={Position.Top} id='a'/>
           <Handle type="source" position={Position.Bottom} id='b'/>
           <Handle type="source" position={Position.Left} id='c'/>
           <Handle type="source" position={Position.Right} id='d'/>
         </div>
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Create a new node (and a new Notion Page) on double click
  const handleClick = async (event) => {
    console.log("hi")
    const newNode = {
      id: Math.random().toString(),
      position: { x: event.clientX, y: event.clientY },
      data: { label: 'New Page' },
      type: 'customNode',
    };
    
    setNodes((nds) => nds.concat(newNode));
    
    // Tell Notion to create this page in the background
    await fetch('/api/create-page', { 
        method: 'POST', 
        body: JSON.stringify(newNode) 
    });
  };

   const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button onClick={handleClick}>
      Click Me
    </button>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes = {nodeTypes}
        //onNodeClick={(e, node) => window.open(`https://notion.so/${node.id.replace(/-/g, '')}`)}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode="Loose"
        connectionLineType='SimpleBezier'
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}