const Flashcard = require('../models/flashcard');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/errorCodes'); // Correctly import ErrorCodes

// Create a new flashcard
exports.createFlashcard = async (req, res, next) => {
  const { question, answer, box, nextReviewDate } = req.body;
  const userId = req.user.userId;

  try {
    const flashcard = new Flashcard({
      question,
      answer,
      box,
      nextReviewDate,
      user: userId
    });

    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    next(new AppError('Failed to create flashcard', 500, ErrorCodes.DATABASE_ERROR));
  }
};

// Get all flashcards for the authenticated user
exports.getFlashcards = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const flashcards = await Flashcard.find({ user: userId });
    res.status(200).json(flashcards);
  } catch (err) {
    next(new AppError('Failed to fetch flashcards', 500, ErrorCodes.DATABASE_ERROR));
  }
};

// Update a flashcard by ID
exports.updateFlashcard = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { question, answer, box, nextReviewDate } = req.body;

  try {
    let flashcard = await Flashcard.findOne({ _id: id, user: userId });
    if (!flashcard) {
      return next(new AppError('Flashcard not found', 404, ErrorCodes.NOT_FOUND));
    }

    flashcard.question = question || flashcard.question;
    flashcard.answer = answer || flashcard.answer;
    flashcard.box = box || flashcard.box;
    flashcard.nextReviewDate = nextReviewDate || flashcard.nextReviewDate;

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (err) {
    next(new AppError('Failed to update flashcard', 500, ErrorCodes.DATABASE_ERROR));
  }
};

// Delete a flashcard by ID
exports.deleteFlashcard = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const flashcard = await Flashcard.findOneAndDelete({ _id: id, user: userId });
    if (!flashcard) {
      return next(new AppError('Flashcard not found', 404, ErrorCodes.NOT_FOUND));
    }
    res.status(200).json({ message: 'Flashcard deleted' });
  } catch (err) {
    next(new AppError('Failed to delete flashcard', 500, ErrorCodes.DATABASE_ERROR));
  }
};