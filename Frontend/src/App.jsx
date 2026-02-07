import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* Define more routes here as needed */}
      </Routes>
    </div>
  );
};

export default App;
