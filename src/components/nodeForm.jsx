/* eslint-disable react/button-has-type */
/* eslint-disable import/no-extraneous-dependencies */
// import React from 'react';

import React from 'react';
import { useNavigate, useParams } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { useInputStore } from '../store/useInput';
import { useRole } from './roleContext';

function NodeFormPage({ allNodes }) {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { inputs, setInput } = useInputStore();
  const { userRole } = useRole();

  const currentIndex = allNodes.findIndex((n) => n.id === nodeId);
  const node = allNodes[currentIndex];
  if (!node) return <div>Node not found</div>;
  const options = node.data?.factors?.map((f) => ({ value: f, label: f })) || [];

  // Always available
  const getHomePath = () => {
    if (userRole === 'therapist') return '/therapist';
    if (userRole === 'clientFull') return '/search';
    return '/client';
  };

  // Cycle to the next node (wraps at end)
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % allNodes.length;
    navigate(`/form/${allNodes[nextIndex].id}`);
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>{node.data.label}</h2>
      </div>
      <div className="form-content">
        <CreatableSelect
          value={inputs[nodeId] ? { value: inputs[nodeId], label: inputs[nodeId] } : null}
          options={options}
          onChange={(opt) => setInput(nodeId, opt.value)}
          onCreateOption={(val) => setInput(nodeId, val)}
        />
      </div>
      <div className="form-buttons">
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={goToNext}>Next</button>
        <button onClick={() => navigate(getHomePath())}>Finish & Go Home</button>
      </div>
    </div>
  );
}

export default NodeFormPage;
