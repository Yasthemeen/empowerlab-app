import React from 'react';
import FlowDiagram from './flowDiagram';

function TherapistGraph() {
  return (
    <>
      <div className="text">
        <h1 className="diagram-title"> Therapist Input </h1>
        <h2 className="diagram-subtitle"> Add input to the database </h2>
      </div>
      <FlowDiagram userRole="therapist" />;
    </>
  );
}

export default TherapistGraph;
