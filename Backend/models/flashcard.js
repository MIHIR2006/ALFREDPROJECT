const mongoose = require('mongoose');

// Define the Flashcard schema
const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  box: {
    type: Number,
    required: true,
    default: 1,
  },
  nextReviewDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
module.exports = Flashcard;