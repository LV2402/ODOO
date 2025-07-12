const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Question = require('../models/Question');

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description || !tags || tags.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newQuestion = await Question.create({
      title,
      description, // rich text HTML
      tags,
      author: req.user._id,
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/questions
// @desc    Get all questions (with optional tag filter)
// @access  Public
router.get('/', async (req, res) => {
  const tag = req.query.tag;

  try {
    const query = tag ? { tags: tag } : {};
    const questions = await Question.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username' },
      })
      .populate('acceptedAnswer');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;