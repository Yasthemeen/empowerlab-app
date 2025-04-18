/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { MarkerType, applyNodeChanges } from 'reactflow';
import { useNavigate } from 'react-router';
import 'reactflow/dist/style.css';
import { getClientInputs, getTherapistInputs, submitInputData } from '../api/api';
import DropdownNode from './inputDropdown';

import '@xyflow/react/dist/style.css';

function FlowDiagram({ userRole = 'client' }) {
  const nodeTypes = useMemo(() => ({ dropdown: DropdownNode }), []);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const positionMap = {
    'mechanisms of change': { x: 134.69, y: 633.08 },
    'extratheraputic factors': { x: -573.73, y: 667.70 },
    moderators: { x: -493.27, y: 187.95 },
    'inactive components': { x: 935.26, y: 482.63 },
    'clinical outcome in patient': { x: 139.72, y: 870.32 },
    treatment: { x: 210.12, y: -140.17 },
    'descriptive components': { x: 126.32, y: 115.48 },
    mediators: { x: 905.17, y: 139.57 },
    'active components': { x: 156.48, y: 380.61 },
  };

  const handleDropdownChange = (id, value) => {
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, value } } : node)));
  };

  const handleSubmit = async () => {
    const selected = {};
    nodes.forEach((node) => {
      selected[node.id] = node.data.value;
    });

    try {
      const res = await submitInputData(selected);
      setResult(res.result);
    } catch (error) {
      console.error('Error submitting:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const loadInputs = async () => {
      const inputNodes = userRole === 'therapist'
        ? await getTherapistInputs()
        : await getClientInputs();

      console.log('Fetched inputs:', inputNodes);

      // Create nodes for each input item
      const nodeList = inputNodes.map((item, idx) => ({
        id: item.name,
        type: 'dropdown',
        position: positionMap[item.name] || { x: Math.random() * 1000, y: Math.random() * 1000 }, // Random fallback
        data: {
          label: item.label,
          factors: item.factors,
          value: '',
          onChange: handleDropdownChange,
          id: item.name,
        },
      }));

      // Create edges based on dependsOn relationships
      const edgeList = inputNodes
        .filter((n) => n.dependsOn && n.dependsOn.length > 0)
        .flatMap((n) => n.dependsOn.map((dependency) => ({
          id: `${dependency}-${n.name}`,
          source: n.name,
          target: dependency,
          animated: false,
          type: 'default',
          style: { strokeWidth: 1 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: 'grey',
          },
        })));

      setNodes(nodeList);
      setEdges(edgeList);
    };

    loadInputs();
  }, [userRole]);

  return (
    <div style={{ height: '100vh', width: '100%' }} className="diagram-wrapper">
      <div className="text">
        <h1 className="diagram-title">Placeholder Title</h1>
        <h2 className="diagram-subtitle">Click the dropdowns and select to recieve a diagnosis</h2>
      </div>
      <div className="reactflow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable
          zoomOnScroll={false}
          panOnScroll={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          onNodesChange={(changes) => {
            setNodes((nds) => {
              const updated = applyNodeChanges(changes, nds);
              console.log('Updated node positions:', updated);
              return updated;
            });
          }}
        />

        <div className="button-container">
          {userRole === 'client' && (
            <button
              className="button button-client"
              onClick={() => navigate('/therapist')}
            >
              Go to Therapist View
            </button>
          )}

          {userRole === 'therapist' && (
            <button
              className="button button-therapist"
              onClick={() => navigate('/')}
            >
              Go to Client View
            </button>
          )}

          <button
            className="button button-submit"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {result && (
            <div className="success-message">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlowDiagram;
