const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('author', 'name').sort({createdAt: -1});
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description } = req.body;

    const newCourse = new Course({
      title,
      description,
      author: req.user.id,
    });

    if (req.file) {
      newCourse.image = `/uploads/${req.file.filename}`;
    }

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('author', 'name');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/stats (Get course counts for the logged-in user)
router.get('/stats', auth, async (req, res) => {
  try {
    let count = 0;
    if (req.user.role === 'instructor') {
      // For instructors, count courses they have authored
      count = await Course.countDocuments({ author: req.user.id });
    } else {
      // For students, count courses they are enrolled in
      // This requires the 'enrolledStudents' field in your Course model.
      // count = await Course.countDocuments({ enrolledStudents: req.user.id });
    }
    res.json({ count });
  } catch (err) {
    console.error('Error fetching course stats:', err);
    res.status(500).json({ error: 'Failed to fetch course stats.' });
  }
});

module.exports = router;
