const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
  videos: [
    {
      type: String,
    },
  ],
  truthfulnessDeclaration: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null, // Can be null if unassigned
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Issue', IssueSchema);
