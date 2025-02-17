import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';

const ReviewSession = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flashcards');
        const allCards = Array.isArray(response.data) ? response.data : [];
        
        // Filter cards due for review
        const today = new Date();
        const dueCards = allCards.filter(card => {
          const reviewDate = new Date(card.nextReviewDate);
          return reviewDate <= today;
        });
        
        setFlashcards(dueCards);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const calculateNextReviewDate = (box) => {
    const today = new Date();
    const daysToAdd = Math.pow(2, box - 1); // 1, 2, 4, 8, or 16 days
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString();
  };

  const handleShowAnswer = () => setShowAnswer(true);

  const handleResponse = async (correct) => {
    try {
      const currentCard = flashcards[currentIndex];
      const newBox = correct ? 
        Math.min(currentCard.box + 1, 5) : 
        Math.max(1, currentCard.box - 1);

     // Remove _id from the update data
    const updateData = {
        box: newBox,
        nextReviewDate: calculateNextReviewDate(newBox)
      };

      await api.put(`/flashcards/${currentCard._id}`, updateData);
      
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        navigate('/dashboard', { state: { message: 'Review session completed!' } });
      }
    } catch (err) {
      setError('Failed to update flashcard. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <h3>🎉 All caught up!</h3>
        <p>No flashcards due for review today.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/create-flashcard')}
        >
          Create New Flashcard
        </button>
      </div>
    );
  }

  if (currentIndex >= flashcards.length) {
    return (
      <div className="container mt-4 text-center">
        <h3>🎉 Session Complete!</h3>
        <p>You've reviewed all your due cards.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <div className="progress">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {currentIndex + 1} / {flashcards.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center">
          <h5 className="card-title mb-4">Question</h5>
          <p className="card-text fs-4">{currentCard.question}</p>

          {showAnswer ? (
            <>
              <hr className="my-4" />
              <h5 className="card-title mb-4">Answer</h5>
              <p className="card-text fs-4">{currentCard.answer}</p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button 
                  className="btn btn-danger"
                  onClick={() => handleResponse(false)}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Got it Wrong
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => handleResponse(true)}
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Got it Right
                </button>
              </div>
            </>
          ) : (
            <button 
              className="btn btn-primary mt-4"
              onClick={handleShowAnswer}
            >
              Show Answer
            </button>
          )}

          <div className="mt-3">
            <small className="text-muted">
              Current Box: {currentCard.box} | 
              Cards Remaining: {flashcards.length - currentIndex - 1}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSession;