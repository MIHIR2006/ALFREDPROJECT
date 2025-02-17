const Joi = require('joi');

const createFlashcardSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  box: Joi.number().required(),
  nextReviewDate: Joi.date().required(),
});
const updateFlashcardSchema = Joi.object({
  question: Joi.string().min(1),
  answer: Joi.string().min(1),
  box: Joi.number().min(1).max(5).required()
    .messages({
      'number.min': 'Box number must be at least 1',
      'number.max': 'Box number cannot exceed 5',
      'any.required': 'Box number is required'
    }),
  nextReviewDate: Joi.date().required()
    .messages({
      'date.base': 'Next review date must be a valid date',
      'any.required': 'Next review date is required'
    })
}).min(1); // Ensure at least one field is being updated
module.exports = {
  createFlashcardSchema,
  updateFlashcardSchema,
};