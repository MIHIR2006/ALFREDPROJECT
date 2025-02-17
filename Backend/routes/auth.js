const express = require('express');
const { register, login, updatePassword } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validation/authValidation');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', validationMiddleware(registerSchema), register);

// Login a user
router.post('/login', validationMiddleware(loginSchema), login);

// Update user password
router.put('/users/:userId/password', updatePassword);

module.exports = router;