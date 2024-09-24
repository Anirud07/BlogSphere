import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import BlogModal from './BlogModal';

function MyBlogs() {
  const { darkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/blogs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const deleteBlog = async (e, id) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent div
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      <div className="flex-grow container mx-auto p-4 mt-20 mb-24">
        <h1 className={`text-4xl font-bold text-center mb-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>My Blogs</h1>
        <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {blogs.map((blog) => (
            <CSSTransition key={blog._id} timeout={500} classNames="fade">
              <div 
                className={`rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-white'} cursor-pointer`}
                onClick={() => openBlogModal(blog)}
              >
                <div className="p-6">
                  <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h2>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{blog.content.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(blog.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => deleteBlog(e, blog._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <Footer />
      {selectedBlog && <BlogModal blog={selectedBlog} onClose={closeBlogModal} />}
    </div>
  );
}

export default MyBlogs;