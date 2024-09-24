const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Blog = require('../models/Blog');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { width: 1000, height: 1000, crop: "limit" }
      );
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({ 
      title, 
      content, 
      imageUrl, 
      user: req.user.id 
    });
    const savedBlog = await newBlog.save();
    res.json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog', details: error.message });
  }
});

router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    let updateData = { title, content };

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      );
      updateData.imageUrl = result.secure_url;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found or you do not have permission to update it' });
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findOneAndDelete({ _id: id, user: req.user.id });
    if (deletedBlog) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog not found or you do not have permission to delete it' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;