const express = require('express');
const flashcardController = require('../controllers/flashcardController');
const { createFlashcardSchema, updateFlashcardSchema } = require('../validation/flashcardValidation');
const validationMiddleware = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new flashcard
router.post('/', validationMiddleware(createFlashcardSchema), flashcardController.createFlashcard);

// Get all flashcards for the authenticated user
router.get('/', flashcardController.getFlashcards);

// Update a flashcard by ID
router.put('/:id', validationMiddleware(updateFlashcardSchema), flashcardController.updateFlashcard);

// Delete a flashcard by ID
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;