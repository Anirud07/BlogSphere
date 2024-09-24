import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} py-4 w-full fixed bottom-0 left-0 right-0 text-xs sm:text-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <span className="font-bold text-base sm:text-lg">BlogSphere</span> - Share your thoughts with the world
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <a href="#" className="hover:text-blue-400 transition duration-300">About</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Contact</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Privacy</a>
          </div>
        </div>
        <div className="mt-2 text-center text-xs">
          © {new Date().getFullYear()} BlogSphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;