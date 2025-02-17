import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios'; // Import the configured api instance

const CreateFlashcard = () => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    box: 1,
    nextReviewDate: new Date().toISOString().split('T')[0] // Set default date to today
  });
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/flashcards', formData);
      console.log('Flashcard created:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      setError(error.response?.data?.message || 'Failed to create flashcard');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Flashcard</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="card p-4">
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
        <div className="mb-3">
          <label htmlFor="box" className="form-label">Box Number</label>
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
        <div className="mb-3">
          <label htmlFor="nextReviewDate" className="form-label">Next Review Date</label>
          <input
            type="date"
            className="form-control"
            id="nextReviewDate"
            name="nextReviewDate"
            value={formData.nextReviewDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Flashcard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFlashcard;