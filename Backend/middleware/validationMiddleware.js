const { ValidationError } = require('joi');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/errorCodes');

const validationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(new AppError(message, 400, ErrorCodes.INVALID_INPUT));
  }
  next();
};

module.exports = validationMiddleware;