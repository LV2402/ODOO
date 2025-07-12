const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  isRead: { type: Boolean, default: false },
  link: { type: String }, // ✅ Add this field
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
