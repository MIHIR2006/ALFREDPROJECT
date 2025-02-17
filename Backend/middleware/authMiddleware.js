const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/errorCodes');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return next(new AppError('No token, authorization denied', 401, ErrorCodes.UNAUTHORIZED));
    }

    // Extract token from Bearer scheme
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        next(new AppError('Token is not valid', 401, ErrorCodes.UNAUTHORIZED));
    }
};

module.exports = authMiddleware;