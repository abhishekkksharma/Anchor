import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

const Navbar = (props) => {
  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 backdrop-blur-xl bg-gradient-to-b from-white/80 to-transparent dark:from-black/20 dark:to-transparent'>
        {/* navbar left */}
        <div className='flex gap-4 items-center'>
          <div className="pl-10 flex items-center gap-2">
            <img src="" alt="logo" />
            <p className="text-2xl font-semibold text-black dark:text-white">Anchor</p>
          </div>
        </div>
        {/* navbar right side  */}
        <div className='flex items-center gap-6'>
          <AnimatedThemeToggler />
          <Link to="/login" className='font-mono text-lg px-3 p-1 hover:text-white dark:text-white'>Login</Link>
          <Link to="/login" className='font-mono text-lg text-white hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-black px-3 p-1'>Sign Up</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
