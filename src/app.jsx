import React from 'react';
import { Route, Routes } from 'react-router';
import ClientGraph from './components/ClientGraph';
import TherapistGraph from './components/TherapistGraph';
import SearchGraph from './components/searchGraph';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchGraph />} />
      <Route path="/client" element={<ClientGraph />} />
      <Route path="/therapist" element={<TherapistGraph />} />
      {/* <Route path="/search" element={<SearchGraph />} /> */}

    </Routes>
  );
}

export default App;

// import React, { useEffect, useState } from 'react';
// import { Route, Routes } from 'react-router';
// import ClientGraph from './components/ClientGraph';
// import TherapistGraph from './components/TherapistGraph';
// import SearchGraph from './components/searchGraph';

// function App() {
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const handleResize = () => {
//       const scaleX = window.innerWidth / 1920;
//       const scaleY = window.innerHeight / 1080;
//       const newScale = Math.min(scaleX, scaleY);
//       setScale(newScale);
//     };

//     handleResize(); // set initial scale
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div
//       className="scaled-container"
//       style={{
//         transform: `scale(${scale})`,
//         transformOrigin: 'top left',
//         width: '1920px',
//         height: '1080px',
//         overflow: 'hidden',
//         position: 'absolute',
//       }}
//     >
//       <Routes>
//         <Route path="/" element={<ClientGraph />} />
//         <Route path="/therapist" element={<TherapistGraph />} />
//         <Route path="/search" element={<SearchGraph />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
