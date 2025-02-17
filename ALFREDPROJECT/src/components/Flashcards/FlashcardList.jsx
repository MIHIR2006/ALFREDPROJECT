import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [dueFlashcards, setDueFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flashcards');
        const allCards = response.data || [];
        
        const today = new Date();
        const dueCards = allCards.filter(card => {
          const reviewDate = new Date(card.nextReviewDate);
          return reviewDate <= today;
        });
        
        setFlashcards(allCards);
        setDueFlashcards(dueCards);
        setError(null);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleResponse = async (correct) => {
    try {
      const currentCard = dueFlashcards[currentCardIndex];
      const newBox = correct ? 
        Math.min(currentCard.box + 1, 5) : 
        Math.max(currentCard.box - 1, 1);

      const daysToAdd = Math.pow(2, newBox - 1);
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

      await api.put(`/flashcards/${currentCard._id}`, {
        box: newBox,
        nextReviewDate: nextReviewDate.toISOString()
      });

      if (currentCardIndex < dueFlashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        navigate('/dashboard', { state: { message: 'Review completed!' } });
      }
    } catch (err) {
      setError('Failed to update flashcard');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
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
        </div>
      </div>
    );
  }

  if (!dueFlashcards.length) {
    return (
      <div className="container text-center mt-5">
        <h3>🎉 All caught up!</h3>
        <p className="lead">No flashcards due for review today.</p>
        <button 
          className="btn btn-primary btn-lg mt-3"
          onClick={() => navigate('/create-flashcard')}
        >
          Create New Flashcard
        </button>
      </div>
    );
  }

  const currentCard = dueFlashcards[currentCardIndex];

  return (
    <div className="container mt-4">
      <div className="progress mb-4">
        <div 
          className="progress-bar bg-success" 
          style={{ width: `${(currentCardIndex / dueFlashcards.length) * 100}%` }}
        >
          {currentCardIndex + 1} / {dueFlashcards.length}
        </div>
      </div>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          {!showAnswer ? (
            <>
              <h5 className="card-title mb-4">Question</h5>
              <p className="card-text fs-4 mb-4">{currentCard.question}</p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setShowAnswer(true)}
              >
                Show Answer
              </button>
            </>
          ) : (
            <>
              <h5 className="card-title mb-4">Answer</h5>
              <p className="card-text fs-4 mb-4">{currentCard.answer}</p>
              <div className="d-flex gap-2 justify-content-center">
                <button 
                  className="btn btn-danger btn-lg"
                  onClick={() => handleResponse(false)}
                >
                  Got it Wrong
                </button>
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => handleResponse(true)}
                >
                  Got it Right
                </button>
              </div>
            </>
          )}
        </div>
        <div className="card-footer text-center">
          <span className="badge bg-primary me-2">Box {currentCard.box}</span>
          <small className="text-muted">
            Cards remaining: {dueFlashcards.length - currentCardIndex}
          </small>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;
  