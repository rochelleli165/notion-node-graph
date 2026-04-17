import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { applyNodeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

// A simple helper to prevent spamming the Notion API
let debounceTimer;
const syncToNotion = (changes) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Only sync if the change was a "position" change (dragging)
    const positionChange = changes.find(c => c.type === 'position' && c.dragging === false);
    
    if (positionChange) {
      fetch('/api/update-notion-node', {
        method: 'POST',
        body: JSON.stringify({
          id: positionChange.id,
          x: positionChange.position.x,
          y: positionChange.position.y
        })
      });
    }
  }, 500); // Wait 500ms after the user stops moving
};

export default function SimpleGraph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // 1. Initial Load: Fetch from your self-provisioned database
  useEffect(() => {
    async function loadData() {
      const { nodes: initialNodes, edges: initialEdges } = await fetch('/api/get-notion-data');
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    loadData();
  }, []);

  // 2. Handle Dragging: Update local state immediately for that "CS Academy" feel
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      // Trigger background sync (Step 4)
      syncToNotion(changes);
    },
    []
  );

  // 3. Handle Connections: Dragging a line between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ height: '500px', border: '1px solid #ddd' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeClick={(e, node) => window.open(`https://notion.so/${node.id.replace(/-/g, '')}`, '_blank')}
      />
    </div>
  );
}