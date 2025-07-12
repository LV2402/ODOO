const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const protect = require('../middleware/authMiddleware');

// Get notifications for logged-in user
router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark notifications as read
router.patch('/mark-read', protect, async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
