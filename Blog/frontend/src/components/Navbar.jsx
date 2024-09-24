import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { BookmarkIcon } from '@heroicons/react/24/solid';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Force a re-render of the app
    window.location.href = '/login';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:text-blue-500 transition duration-300`}>BlogSphere</Link>
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link to="/" className={`text-sm sm:text-base ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-300`}>Home</Link>
            <Link to="/my-blogs" className={`text-sm sm:text-base ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-300`}>My Blogs</Link>
            <Link to="/bookmarked-blogs" className={`text-sm sm:text-base ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition duration-300`}>
              <BookmarkIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} p-1 sm:p-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className={`text-sm sm:text-base ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;