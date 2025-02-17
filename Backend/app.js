const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const authRoutes = require('./routes/auth');
const flashcardRoutes = require('./routes/flashcards');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Define allowed origins for CORS (including both localhost and production frontend domain)
const allowedOrigins = [
  'http://localhost:5174',  // Local development frontend URL
  'https://alfredproject-6woj-zeta.vercel.app' // Production frontend URL
];

// CORS options to restrict origins and handle credentials
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an origin (like Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is allowed
  credentials: true,  // Allow credentials (cookies, headers)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};

// Middleware to parse JSON bodies
app.use(express.json());

// Use the cors middleware with the custom options
app.use(cors(corsOptions));

// Import routes
app.use('/api/auth', authRoutes);
app.use('/api/flashcards', authMiddleware, flashcardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Flashcard Learning App');
});

// Global error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
