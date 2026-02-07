import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Auth } from './pages';
import { GridSmallBackground } from "../src/components/ui/grid-small-background";

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
