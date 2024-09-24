const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
app.use('/api', authRoutes);
app.use('/api/blogs', blogRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});