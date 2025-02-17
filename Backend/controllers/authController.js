const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/errorCodes');

// Register a new user
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail) {
      return next(new AppError('User already exists with this email', 400, ErrorCodes.DUPLICATE_ENTRY));
    }

    if (existingUserByUsername) {
      return next(new AppError('Username already taken', 400, ErrorCodes.DUPLICATE_ENTRY));
    }

    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: user._id, username: user.username, email: user.email });
  } catch (err) {
    next(new AppError('Failed to register user', 500, ErrorCodes.DATABASE_ERROR));
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError('Invalid credentials', 400, ErrorCodes.INVALID_INPUT));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 400, ErrorCodes.INVALID_INPUT));
    }

    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // In login controller
    res.status(200).json({ token, userId: user._id, username: user.username, email: user.email });
  } catch (err) {
    next(new AppError('Login failed', 500, ErrorCodes.DATABASE_ERROR));
  }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404, ErrorCodes.NOT_FOUND));
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(new AppError('Failed to update password', 500, ErrorCodes.DATABASE_ERROR));
  }
};