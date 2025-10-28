// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

// Middleware function to verify JWT tokens
const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    // Token is expected in the "Authorization" header like: "Bearer <token>"
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7); // Extract token after "Bearer "

    // 2. Verify the token
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is not defined.');
      return res.status(500).json({ error: 'Internal server configuration error.' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt && (decoded.iat * 1000 < currentUser.passwordChangedAt.getTime())) {
      return res.status(401).json({ error: 'User recently changed password. Please log in again.' });
    }

    // 5. Grant access to protected route
    req.user = currentUser; // Attach full user object to the request
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    res.status(500).json({ error: 'An unexpected error occurred during authentication.' });
  }
};

module.exports = auth;
