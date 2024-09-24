import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function BlogModal({ blog, onClose }) {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-4xl w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl overflow-hidden`}>
        <div className="flex flex-col md:flex-row h-full">
          {blog.imageUrl && (
            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover"
                onLoad={(e) => e.target.style.opacity = 1}
                style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
              />
            </div>
          )}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
              <p className="overflow-y-auto max-h-[calc(100vh-16rem)]">{blog.content}</p>
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 mt-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition duration-300 self-end`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogModal;