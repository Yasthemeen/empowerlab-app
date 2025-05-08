import React, { useState, useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import FlowDiagram from './components/flowDiagram';
import NodeFormPage from './components/nodeForm';
import { RoleContext } from './components/roleContext';
import { useInputStore } from './store/useInput';

function getRoleFromPath(pathname) {
  if (pathname.startsWith('/therapist')) return 'therapist';
  if (pathname.startsWith('/search')) return 'clientFull';
  return 'client';
}

function App() {
  const [nodes, setNodes] = useState([]);
  const [userRole, setUserRole] = useState('client');
  const location = useLocation();
  const resetInputs = useInputStore((state) => state.resetInputs);
  const contextValue = useMemo(() => ({ userRole, setUserRole }), [userRole]);

  useEffect(() => {
    const isFormPage = location.pathname.startsWith('/form');
    const newRole = getRoleFromPath(location.pathname);

    // Only update role and reset inputs when switching views (not on form pages)
    if (!isFormPage && newRole !== userRole) {
      setUserRole(newRole);
      resetInputs();
      setNodes([]);
    }
  }, [location.pathname, userRole]);

  return (
    <RoleContext.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={<FlowDiagram userRole="client" nodes={nodes} setNodes={setNodes} />} />
        <Route path="/client" element={<FlowDiagram userRole="client" nodes={nodes} setNodes={setNodes} />} />
        <Route path="/therapist" element={<FlowDiagram userRole="therapist" nodes={nodes} setNodes={setNodes} />} />
        <Route path="/search" element={<FlowDiagram userRole="clientFull" nodes={nodes} setNodes={setNodes} />} />
        <Route path="/form/:nodeId" element={<NodeFormPage allNodes={nodes} />} />
      </Routes>
    </RoleContext.Provider>
  );
}

export default App;
