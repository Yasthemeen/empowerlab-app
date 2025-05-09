/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-extraneous-dependencies */
// import React from 'react';

// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import CreatableSelect from 'react-select/creatable';
// import { useInputStore } from '../store/useInput';
// import { useRole } from './roleContext';

import React from 'react';
import { useNavigate, useParams } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { useInputStore } from '../store/useInput';
import { useRole } from './roleContext';

function NodeFormPage({ allNodes }) {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const {
    inputs,
    setInput,
    impacts,
    quantifiers,
    setImpacts,
    setQuantifiers,
  } = useInputStore();
  const { userRole } = useRole();

  const currentIndex = allNodes.findIndex((n) => n.id === nodeId);
  const node = allNodes[currentIndex];
  if (!node) return <div>Node not found</div>;

  const options = node.data?.factors?.map((f) => ({ value: f, label: f })) || [];

  const getHomePath = () => {
    if (userRole === 'therapist') return '/therapist';
    if (userRole === 'clientFull') return '/search';
    return '/client';
  };

  const goToNext = () => {
    let nextIndex = currentIndex;

    do {
      nextIndex = (nextIndex + 1) % allNodes.length;
    } while (allNodes[nextIndex].data?.isReadOnly && nextIndex !== currentIndex);

    if (nextIndex === currentIndex) {
      // All nodes are read-only or no other editable node found
      navigate(getHomePath());
    } else {
      navigate(`/form/${allNodes[nextIndex].id}`);
    }
  };

  const showImpactLevelSlider = ['Desc', 'Act', 'Inact', 'Moderators', 'Extratherapeutic factors'].some((type) => node.data.label?.toLowerCase().includes(type.toLowerCase()));

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

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="impactText">Impact: {impacts[nodeId] ?? 1}</label>
          <input
            id="impactText"
            type="range"
            min="1"
            max="10"
            value={impacts[nodeId] ?? 1}
            onChange={(e) => setImpacts(nodeId, Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div className="slider-labels"
            style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginTop: '0.25rem',
            }}
          >
            <span>Very Unhelpful</span>
            <span>Neutral</span>
            <span>Very Beneficial</span>
          </div>
        </div>

        {/* Conditionally Show Quantifier Slider */}
        {showImpactLevelSlider && (
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="impactSlider">Quantifier: {quantifiers[nodeId] ?? 1}</label>
          <input
            id="impactSlider"
            type="range"
            min="1"
            max="10"
            value={quantifiers[nodeId] ?? 1}
            onChange={(e) => setQuantifiers(nodeId, Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div className="slider-labels"
            style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginTop: '0.25rem',
            }}
          >
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
        )}
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
