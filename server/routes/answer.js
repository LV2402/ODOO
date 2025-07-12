const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const Notification = require('../models/Notification');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User'); // Make sure to import this!

// @route   POST /api/answers/:questionId
// @desc    Post an answer to a question
// @access  Private
router.post('/:questionId', protect, async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;

  if (!content) return res.status(400).json({ message: 'Answer cannot be empty' });

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = await Answer.create({
      content,
      author: req.user._id,
      question: questionId,
    });

    question.answers.push(answer._id);
    await question.save();

    // ✅ Notify the question author (if not answering their own question)
    if (!question.author.equals(req.user._id)) {
      await Notification.create({
        userId: question.author,
        message: `Your question "${question.title}" received a new answer.`,
        link: `/questions/${questionId}#answer-${answer._id}`,
      });
    }

    // ✅ Detect @mentions in the answer and notify mentioned users
    const mentionedUsernames = content.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];

    for (const username of mentionedUsernames) {
      const mentionedUser = await User.findOne({ username });
      if (mentionedUser && !mentionedUser._id.equals(req.user._id)) {
        await Notification.create({
          userId: mentionedUser._id,
          message: `You were mentioned in an answer to "${question.title}".`,
          link: `/questions/${questionId}#answer-${answer._id}`,
        });
      }
    }

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PATCH /api/answers/:id/vote
// @desc    Upvote/downvote an answer
// @access  Private
router.patch('/:id/vote', protect, async (req, res) => {
  const { action } = req.body; // "up" or "down"

  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (action === 'up') {
      answer.votes += 1;
    } else if (action === 'down') {
      answer.votes -= 1;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await answer.save();
    res.json({ message: 'Vote updated', votes: answer.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   PATCH /api/answers/:id/accept
// @desc    Accept an answer for a question (by question owner)
// @access  Private
router.patch('/:answerId/accept', protect, async (req, res) => {
  const { answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId).populate('question');
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const question = await Question.findById(answer.question._id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // ✅ Optional: Only allow question author to accept
    if (req.user.id !== question.author.toString()) {
      return res.status(403).json({ message: 'Only the question author can accept an answer' });
    }

    // Set current answer as accepted
    answer.isAccepted = true;
    await answer.save();

    return res.status(200).json({ message: 'Answer accepted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
