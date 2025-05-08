import React from 'react';
import FlowDiagram from './flowDiagram';

function SearchGraph() {
  return (
    <>
      <div className="text">
        <h1 className="diagram-title"> Search </h1>
        <h2 className="diagram-subtitle"> Click the dropdowns and select to recieve a diagnosis</h2>
      </div>
      <FlowDiagram userRole="clientFull" />
    </>
  );
}

export default SearchGraph;
