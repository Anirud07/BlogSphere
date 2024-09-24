import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import BlogModal from './BlogModal';
import EditBlogModal from './EditBlogModal';
import { PlusIcon, BookmarkIcon } from '@heroicons/react/24/solid';

function BlogList() {
  const { darkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogImage, setNewBlogImage] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
    // Load bookmarked blogs from localStorage
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    setBookmarkedBlogs(storedBookmarks);
  }, [page]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/blogs?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setBlogs(prevBlogs => [...prevBlogs, ...response.data]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const addBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newBlogTitle);
      formData.append('content', newBlogContent);
      if (newBlogImage) {
        formData.append('image', newBlogImage);
      }

      // Show loading state
      const tempBlog = {
        _id: Date.now(),
        title: newBlogTitle,
        content: newBlogContent,
        createdAt: new Date().toISOString(),
        isLoading: true
      };
      setBlogs(prevBlogs => [tempBlog, ...prevBlogs]);

      // Make the API call
      const response = await axios.post('/api/blogs', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      // Update the blog with the actual data from the server
      setBlogs(prevBlogs => [response.data, ...prevBlogs.filter(blog => blog._id !== tempBlog._id)]);

      // Reset form fields
      setNewBlogTitle('');
      setNewBlogContent('');
      setNewBlogImage(null);
    } catch (error) {
      console.error('Error adding blog:', error.response ? error.response.data : error.message);
      // Remove the temporary blog if there was an error
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== tempBlog._id));
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

  const openEditModal = (e, blog) => {
    e.stopPropagation();
    setEditingBlog(blog);
  };

  const closeEditModal = () => {
    setEditingBlog(null);
  };

  const updateBlog = async (updatedBlog) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/blogs/${updatedBlog._id}`, updatedBlog.formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setBlogs(blogs.map(blog => blog._id === updatedBlog._id ? response.data : blog));
      closeEditModal();
    } catch (error) {
      console.error('Error updating blog:', error.response ? error.response.data : error.message);
    }
  };

  const handleImageChange = (e) => {
    setNewBlogImage(e.target.files[0]);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleBookmark = (e, blogId) => {
    e.stopPropagation();
    setBookmarkedBlogs(prevBookmarks => {
      let newBookmarks;
      if (prevBookmarks.includes(blogId)) {
        newBookmarks = prevBookmarks.filter(id => id !== blogId);
      } else {
        newBookmarks = [...prevBookmarks, blogId];
      }
      localStorage.setItem('bookmarkedBlogs', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      <div className="flex-grow w-full p-4 flex flex-col items-center mt-20 mb-24">
        <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Blog Feed</h1>

        <button
          onClick={toggleAddForm}
          className={`mb-8 w-12 h-12 rounded-full ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            showAddForm ? 'rotate-45' : ''
          } flex items-center justify-center`}
          aria-label="Add new blog"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        {showAddForm && (
          <div className="mb-8 w-full max-w-2xl px-4">
            <input
              type="text"
              value={newBlogTitle}
              onChange={(e) => setNewBlogTitle(e.target.value)}
              className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter blog title..."
            />
            <textarea
              value={newBlogContent}
              onChange={(e) => setNewBlogContent(e.target.value)}
              className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              placeholder="Enter blog content..."
              rows="4"
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
            />
            <button
              onClick={addBlog}
              className={`w-full px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Add Blog
            </button>
          </div>
        )}

        <TransitionGroup className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 max-w-7xl">
          {blogs.map((blog) => (
            <CSSTransition key={blog._id} timeout={500} classNames="fade">
              <div 
                className={`rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-white'} cursor-pointer ${blog.isLoading ? 'opacity-50' : ''}`}
                onClick={() => openBlogModal(blog)}
              >
                <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h2>
                    <button
                      onClick={(e) => toggleBookmark(e, blog._id)}
                      className={`p-1 rounded-full ${bookmarkedBlogs.includes(blog._id) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors duration-300`}
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className={`mb-3 sm:mb-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{blog.content.substring(0, 100)}...</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className={`text-xs sm:text-sm mb-2 sm:mb-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(blog.createdAt).toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => openEditModal(e, blog)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => deleteBlog(e, blog._id)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <Footer />
      {selectedBlog && <BlogModal blog={selectedBlog} onClose={closeBlogModal} />}
      {editingBlog && <EditBlogModal blog={editingBlog} onClose={closeEditModal} onUpdate={updateBlog} />}
    </div>
  );
}

export default BlogList;