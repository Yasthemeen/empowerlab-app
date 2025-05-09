/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/button-has-type */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable react/button-has-type */
import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { MarkerType, applyNodeChanges } from 'reactflow';
import { useLocation, useNavigate } from 'react-router';
import 'reactflow/dist/style.css';
import { getClientInputs, getTherapistInputs, submitInputData } from '../api/api';
import InputDropdown from './inputDropdown';
import { useInputStore } from '../store/useInput';

function FlowDiagram({ userRole = 'client', nodes, setNodes }) {
  const nodeTypes = useMemo(() => ({ dropdown: InputDropdown }), []);
  const [edges, setEdges] = useState([]);
  const [result, setResult] = useState('');
  const navigate = useNavigate();
  // const { inputs, setInput } = useInputStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const {
    inputs, setInput, impacts, quantifiers,
  } = useInputStore();
  const navigateAndReload = (path) => {
    navigate(path);
    window.location.reload();
  };
  const positionMap = {
    'mechanisms of change': {
      x: 154.69,
      y: 279.05,
    },
    'extratheraputic factors': {
      x: -589.67,
      y: 384.41,
    },
    moderators: {
      x: -318.05,
      y: -73.09,
    },
    'inactive components': {
      x: 927.26,
      y: 361.81,
    },
    'clinical outcome in patient': {
      x: 130.02,
      y: 482.17,
    },
    treatment: {
      x: 212.12,
      y: -306.57,
    },
    'descriptive components': {
      x: 150.32,
      y: -115.97,
    },
    mediators: {
      x: 706.2,
      y: -67.94,
    },
    'active components': {
      x: 174.48,
      y: 58.04,
    },
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
    const impactMap = {};
    const quantifierMap = {};
    let allFilled = true;

    nodes.forEach((node) => {
      const { value } = node.data;
      selected[node.id] = value;
      impactMap[node.id] = impacts[node.id] ?? 1;
      quantifierMap[node.id] = quantifiers[node.id] ?? 1;

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
          impacts: impactMap,
          quantifiers: quantifierMap,
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
    <div className="diagram-wrapper">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3em' }}>Loading...</div>
      ) : (
        <>
          <div className="text">
            {userRole === 'clientFull' && (
              <>
                <h1 className="diagram-title"> Search Database</h1>
                <h2 className="diagram-subtitle"> Fill in to recieve results </h2>
              </>
            )}
            {userRole === 'client' && (
            <>
              <h1 className="diagram-title"> Client Input </h1>
              <h2 className="diagram-subtitle"> Add Input to the database </h2>
            </>
            )}
            {userRole === 'therapist' && (
            <>
              <h1 className="diagram-title"> Therapist Input </h1>
              <h2 className="diagram-subtitle"> Add Input to the database </h2>
            </>
            )}
          </div>
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
            // onNodesChange={(changes) => {
            //   setNodes((nds) => {
            //     const updated = applyNodeChanges(changes, nds);

            //     const posMap = updated.reduce((acc, node) => {
            //       acc[node.id] = { x: Number(node.position.x.toFixed(2)), y: Number(node.position.y.toFixed(2)) };
            //       return acc;
            //     }, {});
            //     console.log('Updated positionMap:', JSON.stringify(posMap, null, 2));

            //     return updated;
            //   });
            // }}
            onNodeClick={(_, node) => {
              if (node.data?.isReadOnly !== true) {
                navigate(`/form/${node.id}`);
              }
            }}
          />
          <div className="button-container">
            {userRole !== 'clientFull' && (
            <button
              className="button"
              onClick={() => navigateAndReload('/search')}
            >
              Go to Search
            </button>
            )}

            {userRole === 'clientFull' && (
            <button
              className="button"
              onClick={() => navigateAndReload('/')}
            >
              Input Data
            </button>
            )}

            {userRole === 'client' && (
            <button
              className="button"
              onClick={() => navigateAndReload('/therapist')}
            >
              Go to Therapist View
            </button>
            )}

            {userRole === 'therapist' && (
            <button
              className="button"
              onClick={() => navigateAndReload('/')}
            >
              Go to Client View
            </button>
            )}
            <button className="button button-submit" onClick={handleSubmit}>Submit</button>
            {result && <div className="success-message">{result}</div>}
          </div>
          <div className="clear-button-container">
            <button className="button button-clear" onClick={() => window.location.reload()}>
              🔄 Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default FlowDiagram;
