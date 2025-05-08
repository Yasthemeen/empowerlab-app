/* eslint-disable react/button-has-type */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable react/button-has-type */
import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { MarkerType, applyNodeChanges } from 'reactflow';
import { useLocation, useNavigate } from 'react-router';
import 'reactflow/dist/style.css';
import { getClientInputs, getTherapistInputs, submitInputData } from '../api/api';
import InputDropdown from './InputDropdown';
import { useInputStore } from '../store/useInput';

function FlowDiagram({ userRole = 'client', nodes, setNodes }) {
  const nodeTypes = useMemo(() => ({ dropdown: InputDropdown }), []);
  const [edges, setEdges] = useState([]);
  const [result, setResult] = useState('');
  const navigate = useNavigate();
  const { inputs, setInput } = useInputStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  // All dropdown changes ALWAYS go through Zustand
  const handleDropdownChange = (id, value) => {
    setInput(id, value);
    setNodes((nds) => nds.map((node) => (node.id === id
      ? { ...node, data: { ...node.data, value, updated: Date.now() } }
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
    if ((userRole === 'client' || userRole === 'therapist') && !allFilled) {
      setResult('Please select an option for every dropdown before submitting.');
      return;
    }
    try {
      const res = await submitInputData(
        {
          responses: selected,
          role: userRole,
        },
        userRole === 'clientFull',
      );
      const responseValues = res.result || {};
      if (!responseValues || Object.keys(responseValues).length === 0) {
        setResult('Found nothing in the database.');
        return;
      }
      setNodes((prevNodes) => prevNodes.map((node) => {
        const newValue = responseValues[node.id];
        return newValue !== undefined
          ? {
            ...node,
            data: {
              ...node.data,
              value: newValue,
              updated: Date.now(),
              wasAutoFilled: node.data.isReadOnly,
            },
          }
          : node;
      }));
      setResult(userRole === 'clientFull' ? 'Results Found!' : 'Data received, thank you!');
    } catch (error) {
      console.error('Error submitting:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  // Initial load - builds nodes from API and sets values from Zustand
  useEffect(() => {
    setLoading(true); // <-- Set loading to true at start.
    const loadInputs = async () => {
      const inputsApi = userRole === 'therapist' || userRole === 'clientFull'
        ? await getTherapistInputs()
        : await getClientInputs();
      console.log(`Loaded ${inputsApi.length} nodes for userRole=${userRole} at diagram`);

      const clientEditableSet = new Set([
        'treatment',
        'moderators',
        'extratheraputic factors',
        'clinical outcome in patient',
      ]);
      const nodeList = inputsApi.map((item) => {
        const isEditable = userRole === 'therapist'
        || (userRole === 'clientFull' && clientEditableSet.has(item.name))
        || userRole === 'client';
        return {
          id: item.name,
          type: 'dropdown',
          position:
          positionMap[item.name] || {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
          },
          data: {
            label: item.label,
            factors: item.factors,
            value: inputs[item.name] || '',
            onChange: isEditable ? handleDropdownChange : null,
            id: item.name,
            isReadOnly: !isEditable,
          },
        };
      });
      const edgeList = inputsApi
        .filter((n) => n.dependsOn?.length > 0)
        .flatMap((n) => n.dependsOn.map((dep) => ({
          id: `${dep}-${n.name}`,
          source: n.name,
          target: dep,
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
      setLoading(false);
    };
    loadInputs();
  }, [userRole, location.pathname]);

  // When Zustand values change, update the node values in the diagram
  useEffect(() => {
    setNodes((nds) => nds.map((node) => ({
      ...node,
      data: { ...node.data, value: inputs[node.id] || '' },
    })));
  }, [inputs]);

  return (
    <div style={{ height: '100vh', width: '100%' }} className="diagram-wrapper">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3em' }}>Loading...</div>
      ) : (
        <>
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
              setNodes((nds) => applyNodeChanges(changes, nds));
            }}
            onNodeClick={(_, node) => {
              if (node.data?.isReadOnly !== true) {
                navigate(`/form/${node.id}`);
              }
            }}
          />
          <div className="button-container">
            {userRole !== 'clientFull' && (
              <button className="button" onClick={() => navigate('/')}>
                Go to Search
              </button>
            )}
            {userRole === 'clientFull' && (
              <button className="button" onClick={() => navigate('/client')}>Input Data</button>
            )}
            {userRole === 'client' && (
              <button className="button" onClick={() => navigate('/therapist')}>Go to Therapist View</button>
            )}
            {userRole === 'therapist' && (
              <button className="button" onClick={() => navigate('/')}>Go to Client View</button>
            )}
            <button className="button button-submit" onClick={handleSubmit}>Submit</button>
            {result && <div className="success-message">{result}</div>}
          </div>
        </>
      )}
    </div>
  );
}
export default FlowDiagram;
