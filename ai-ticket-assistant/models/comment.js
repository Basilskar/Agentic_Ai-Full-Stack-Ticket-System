// Import dependencies
const mongoose = require('mongoose');

// Define comment schema
const commentSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create and export Comment model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;