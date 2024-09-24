import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import BlogModal from './BlogModal';
import { BookmarkIcon } from '@heroicons/react/24/solid';

function BookmarkedBlogs() {
  const { darkMode } = useTheme();
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBookmarkedBlogs();
  }, []);

  const fetchBookmarkedBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
      const response = await axios.get('/api/blogs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allBlogs = response.data;
      const filteredBlogs = allBlogs.filter(blog => storedBookmarks.includes(blog._id));
      setBookmarkedBlogs(filteredBlogs);
    } catch (error) {
      console.error('Error fetching bookmarked blogs:', error);
    }
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  const removeBookmark = (e, blogId) => {
    e.stopPropagation();
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    const updatedBookmarks = storedBookmarks.filter(id => id !== blogId);
    localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
    setBookmarkedBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      <div className="flex-grow w-full p-4 flex flex-col items-center mt-20 mb-24">
        <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Bookmarked Blogs</h1>

        <TransitionGroup className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 max-w-7xl">
          {bookmarkedBlogs.map((blog) => (
            <CSSTransition key={blog._id} timeout={500} classNames="fade">
              <div 
                className={`rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-white'} cursor-pointer`}
                onClick={() => openBlogModal(blog)}
              >
                <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h2>
                    <button
                      onClick={(e) => removeBookmark(e, blog._id)}
                      className="p-1 rounded-full text-yellow-500 hover:text-yellow-600 transition-colors duration-300"
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className={`mb-3 sm:mb-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{blog.content.substring(0, 100)}...</p>
                  <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(blog.createdAt).toLocaleString()}
                  </span>
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

export default BookmarkedBlogs;