import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Auth, Login, Signup } from './pages';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        {/* Protected route - redirects to /about if not logged in */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Login route - redirects to / if already logged in */}
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Signup route - redirects to / if already logged in */}
        <Route path='/signup' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Legacy auth route - redirects to / if already logged in */}
        <Route path='/auth' element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />

        {/* About page - accessible to everyone, default landing for non-authenticated users */}
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
};

export default App;


