const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const { instructor } = require('../middleware/roles');

// @route   GET /api/admin/quizzes/:courseId
// @desc    Get a quiz for a specific course
// @access  Private, Instructor
router.get('/:courseId', [auth, instructor], async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('quiz');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course.quiz || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/quizzes/:courseId
// @desc    Update a quiz for a specific course
// @access  Private, Instructor
router.put('/:courseId', [auth, instructor], async (req, res) => {
  try {
    const { quiz } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.courseId, { quiz }, { new: true });
    res.json(course.quiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;