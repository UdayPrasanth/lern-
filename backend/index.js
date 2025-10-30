const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const coursesRoute = require('./routes/courses');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const usersRoute = require('./routes/users');

// Initialize the app
const app = express();

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // match your frontend port
  credentials: true
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies. This should be applied globally.
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/courses', coursesRoute);
app.use('/api/profile', profileRoute);
app.use('/api/users', usersRoute);

// Default route
app.get('/', (req, res) => res.send({ status: 'lern backend running' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('Hint: MongoDB server is not running or is inaccessible.');
      console.error(`Please ensure a MongoDB instance is running at "${MONGO_URI}"`);
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
