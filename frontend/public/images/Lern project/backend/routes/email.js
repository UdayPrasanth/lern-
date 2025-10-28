const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const { instructor } = require('../middleware/roles');

// @route   POST /api/email/send-feedback
// @desc    Send feedback email from an instructor to a student
// @access  Private, Instructor
router.post('/send-feedback', [auth, instructor], async (req, res) => {
  const { to, subject, message } = req.body;

  if (!process.env.FEEDBACK_EMAIL || !process.env.FEEDBACK_PASS) {
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email service
    auth: {
      user: process.env.FEEDBACK_EMAIL,
      pass: process.env.FEEDBACK_PASS
    }
  });

  try {
    await transporter.sendMail({ from: process.env.FEEDBACK_EMAIL, to, subject, text: message });
    res.json({ success: true, message: 'Feedback sent successfully.' });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;