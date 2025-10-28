const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');

// @route   POST /api/quiz/submit
// @desc    Submit a user's quiz results
// @access  Private
router.post('/submit', auth, async (req, res) => {
  const { userId, courseId, answers, score } = req.body;

  try {
    const result = new QuizResult({ userId, courseId, answers, score });
    await result.save();
    res.status(201).json({ message: 'Quiz submitted successfully' });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// @route   GET /api/quiz/results/:courseId
// @desc    Get all quiz results for a specific course
// @access  Private (should be restricted to instructors)
router.get('/results/:courseId', auth, async (req, res) => {
  const { courseId } = req.params;
  const results = await QuizResult.find({ courseId }).populate('userId', 'name email');
  res.json(results);
});

module.exports = router;