const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../Models/User');

const Course = require('../models/Course');
// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide both current and new passwords.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error while updating password.' });
  }
});

// @route   DELETE /api/users/me
// @desc    Delete current user's account
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    // Find the user to check their role before deleting
    const user = await User.findById(req.user.id).select('role');

    // If the user is an instructor, delete all courses they have authored.
    if (user.role === 'instructor') {
      // TODO: Add logic here to delete course images from Cloudinary
      await Course.deleteMany({ author: req.user.id });
    }

    // TODO: If the user is a student, un-enroll them from courses.

    // Find and delete the user by the ID from the authenticated token
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Server error while deleting account.' });
  }
});

module.exports = router;