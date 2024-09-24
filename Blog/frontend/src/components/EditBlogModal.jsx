import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function EditBlogModal({ blog, onClose, onUpdate }) {
  const { darkMode } = useTheme();
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    onUpdate({ _id: blog._id, formData });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl overflow-hidden`}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300'} rounded-md`}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300'} rounded-md`}
            placeholder="Content"
            rows="4"
          ></textarea>
          <input
            type="file"
            onChange={handleImageChange}
            className={`w-full px-4 py-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300'} rounded-md`}
          />
          {blog.imageUrl && (
            <img src={blog.imageUrl} alt="Current blog image" className="w-full h-48 object-cover mb-4" />
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 mr-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} rounded-md transition duration-300`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition duration-300`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlogModal;