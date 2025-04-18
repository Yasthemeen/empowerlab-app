import React from 'react';
import { Route, Routes } from 'react-router';
import ClientGraph from './components/ClientGraph';
import TherapistGraph from './components/TherapistGraph';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientGraph />} />
      <Route path="/therapist" element={<TherapistGraph />} />
    </Routes>
  );
}

export default App;
