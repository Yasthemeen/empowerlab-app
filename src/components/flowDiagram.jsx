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
    setNodes((nds) => nds.map((node) => (node.id === id
      ? {
        ...node,
        data: {
          ...node.data,
          value,
          updated: Date.now(),
        },
      }
      : node)));
  };

  const handleSubmit = async () => {
    const selected = {};
    let allFilled = true;

    nodes.forEach((node) => {
      const { value } = node.data;
      selected[node.id] = value;
      if (!value || value.trim() === '') {
        allFilled = false;
      }
    });

    if (userRole === 'client' || userRole === 'therapist') {
      if (!allFilled) {
        setResult('Please select an option for every dropdown before submitting.');
        return;
      }
    }

    console.log('Selected data being submitted:', selected);

    const isSearchMode = userRole === 'clientFull';

    try {
      // Make the request to the backend to submit data and get matching results
      const res = await submitInputData({
        responses: selected,
        role: userRole,
      }, isSearchMode);

      const responseValues = res.result || {};

      if (!responseValues || Object.keys(responseValues).length === 0) {
        setResult('Found nothing in the database.');
        return;
      }

      // Update nodes with returned values from the backend (populate matched fields)
      setNodes((prevNodes) => prevNodes.map((node) => {
        // Check if the backend has a value for this node id
        const newValue = responseValues[node.id];

        if (newValue !== undefined) {
          // If a value is returned from the backend, update the node
          return {
            ...node,
            data: {
              ...node.data,
              value: newValue,
              updated: Date.now(),
              wasAutoFilled: node.data.isReadOnly,
            },
          };
        }

        return node;
      }));

      if (userRole === 'clientFull') {
        setResult('Results Found!');
      } else {
        setResult('Data recieved, thank you!');
      }

      console.log('Backend response:', responseValues);
    } catch (error) {
      console.error('Error submitting:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const loadInputs = async () => {
      let allInputs = [];

      if (userRole === 'therapist') {
        allInputs = await getTherapistInputs();
      } else if (userRole === 'clientFull') {
        allInputs = await getTherapistInputs();
      } else {
        allInputs = await getClientInputs();
      }

      const clientEditableSet = new Set([
        'treatment',
        'moderators',
        'extratheraputic factors',
        'clinical outcome in patient',
      ]);

      const nodeList = allInputs.map((item) => {
        const isEditable = userRole === 'therapist'
          || (userRole === 'clientFull' && clientEditableSet.has(item.name))
          || (userRole === 'client');

        return {
          id: item.name,
          type: 'dropdown',
          position: positionMap[item.name] || {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
          },
          data: {
            label: item.label,
            factors: item.factors,
            value: '',
            onChange: isEditable ? handleDropdownChange : null,
            id: item.name,
            isReadOnly: !isEditable,
          },
        };
      });

      const edgeList = allInputs
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

        {userRole !== 'clientFull' && (
        <div style={{
          position: 'absolute', top: 20, left: 10, zIndex: 10,
        }}
        >
          <button
            className="button button-search"
            onClick={() => navigate('/')}
          >
            Go to Search
          </button>
        </div>
        )}

        <div className="button-container">
          {userRole === 'clientFull' && (
          <button
            className="button button-client"
            onClick={() => navigate('/client')}
          >
            Input Data
          </button>
          )}

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
