import React from 'react';
import FlowDiagram from './flowDiagram';

function ClientGraph() {
  return (
    <>
      <div className="text">
        <h1 className="diagram-title"> Client Input </h1>
        <h2 className="diagram-subtitle"> Add Input to the database </h2>
      </div>
      <FlowDiagram userRole="client" />
    </>
  );
}
export default ClientGraph;
