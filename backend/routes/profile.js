const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../Models/User');
const Course = require('../models/Course');
const upload = require('../middleware/upload');

// @route   GET /api/profile/me
// @desc    Get current user's full profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Find user by ID from token, excluding the password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let dynamicData = {};
    if (user.role === 'instructor') {
      // For instructors, find all courses they have authored
      const courses = await Course.find({ author: user._id });
      dynamicData.courses = courses;
    } else {
      // For students, find all courses they are enrolled in
      const enrollments = await Course.find({ enrolledStudents: { $in: [user._id] } });
      dynamicData.enrollments = enrollments;
    }

    // Combine the base user data with their role-specific data
    res.json({ ...user.toObject(), ...dynamicData });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error while fetching profile.' });
  }
});

// @route   PUT /api/profile/me
// @desc    Update user profile
// @access  Private
router.put('/me', [auth, upload.single('profileImage')], async (req, res) => {
  try {
    const { name, bio, country, city, phone, language, linkedin, facebook, twitter, website } = req.body;

    const profileFields = { name, bio, country, city, phone, language, linkedin, facebook, twitter, website };

    if (req.file) {
      // If a new image is uploaded, add its URL to the profile fields
      profileFields.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: profileFields }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
});

module.exports = router;