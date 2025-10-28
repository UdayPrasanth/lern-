const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');
const { instructor } = require('../middleware/roles');

// @route   GET /api/analytics/course-averages
// @desc    Get average scores for all courses
// @access  Private, Instructor
router.get('/course-averages', [auth, instructor], async (req, res) => {
  try {
    const results = await QuizResult.aggregate([
      { $group: { _id: "$courseId", avgScore: { $avg: "$score" } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { courseTitle: '$course.title', avgScore: 1 } }
    ]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/student-progress/:userId
// @desc    Get a single student's progress over time
// @access  Private, Instructor
router.get('/student-progress/:userId', [auth, instructor], async (req, res) => {
  const results = await QuizResult.find({ userId: req.params.userId }).sort({ submittedAt: 1 });
  res.json(results.map(r => ({ date: r.submittedAt, score: r.score, courseId: r.courseId })));
});

module.exports = router;