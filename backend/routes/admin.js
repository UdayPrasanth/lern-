const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const auth = require('../middleware/auth');
const { instructor } = require('../middleware/roles');

// @route   GET /api/admin/students
// @desc    Get all student users
// @access  Private, Instructor
router.get('/students', [auth, instructor], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email profileImage createdAt');
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;