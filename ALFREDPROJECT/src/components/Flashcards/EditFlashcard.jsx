import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../utils/axios';

const EditFlashcard = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // Initialize form data with passed flashcard or empty values
  const [formData, setFormData] = useState(location.state?.flashcard || {
    question: '',
    answer: '',
    box: 1,
    nextReviewDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only include the fields we want to update
      const updateData = {
        question: formData.question,
        answer: formData.answer,
        box: formData.box,
        nextReviewDate: formData.nextReviewDate
      };
      
      await api.put(`/flashcards/${id}`, updateData);
      navigate('/all-flashcards', {
        state: { message: 'Flashcard updated successfully' }
      });
    } catch (err) {
      console.error('Failed to update flashcard:', err);
      setError(err.response?.data?.message || 'Failed to update flashcard');
    }
  };

  if (!location.state?.flashcard) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          No flashcard data available. Please select a flashcard from the list.
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/all-flashcards')}
        >
          Back to Flashcards
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Flashcard</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="question" className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="answer" className="form-label">Answer</label>
          <input
            type="text"
            className="form-control"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="box" className="form-label">Box</label>
            <input
              type="number"
              className="form-control"
              id="box"
              name="box"
              min="1"
              max="5"
              value={formData.box}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="nextReviewDate" className="form-label">Next Review Date</label>
            <input
              type="date"
              className="form-control"
              id="nextReviewDate"
              name="nextReviewDate"
              value={formData.nextReviewDate?.split('T')[0]}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Flashcard
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/all-flashcards')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlashcard;