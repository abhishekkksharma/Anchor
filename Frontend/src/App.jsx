import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Auth, Login, Signup } from './pages';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        {/* Protected Home */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Login */}
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Signup */}
        <Route path='/signup' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Old Auth Route */}
        <Route path='/auth' element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />

        {/* Public About Route */}
        <Route path='/about' element={<About />} />

        <Route path='*' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
