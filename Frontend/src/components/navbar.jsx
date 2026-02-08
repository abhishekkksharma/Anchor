import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';
import Logo from "../assets/logo.png";

const Navbar = () => {
  const { pathname } = useLocation();

  // hide buttons on /auth page
  const hideAuthButtons = pathname === "/auth";

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 backdrop-blur-4xl bg-gradient-to-b from-white/80 to-transparent dark:from-black/20 dark:to-transparent'>
      
      {/* Left logo */}
      <Link to="/">
      <div className='flex gap-4 items-center'>
        <div className="pl-10 flex items-center gap-2">
          <img src={Logo} className='h-12 dark:invert' alt="logo" />
          <p className="text-2xl font-semibold text-black dark:text-white">Anchor</p>
        </div>
      </div>
      </Link>

      {/* Right side */}
      <div className='flex items-center gap-6'>
        <AnimatedThemeToggler  />

        {/* Hide Login/Signup when on /auth page */}
        {!hideAuthButtons && (
          <>
            <Link 
              to="/auth" 
              className='font-mono text-lg px-3 p-1 hover:text-black hover:font-bold dark:hover:text-white dark:text-white'
            >
              Login
            </Link>

            <Link 
              to="/auth" 
              className='font-mono text-lg text-white hover:-translate-y-1 dark:hover:text-white transition-all duration-300 rounded-2xl bg-black px-3 p-1'
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
