import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const AllFlashcards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/flashcards/${id}`);
            setFlashcards(cards => cards.filter(card => card._id !== id));
        } catch (err) {
            setError('Failed to delete flashcard');
        }
    };

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                setLoading(true);
                const response = await api.get('/flashcards');
                setFlashcards(response.data || []);
            } catch (err) {
                setError('Failed to load flashcards');
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Flashcards</h2>
                <Link to="/create-flashcard" className="btn btn-primary">
                    Create New
                </Link>
            </div>

            <div className="row g-4">
                {flashcards.map(card => (
                    <div key={card._id} className="col-md-6 col-lg-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h5 className="card-title">Question</h5>
                                    <div className="btn-group">
                                        <Link
                                            to={`/edit-flashcard/${card._id}`}
                                            state={{ flashcard: card }}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-pencil"></i> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(card._id)}
                                            className="btn btn-outline-danger btn-sm ms-2"
                                        >
                                            <i className="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="card-text">{card.question}</p>
                                <hr />
                                <h5 className="card-title">Answer</h5>
                                <p className="card-text">{card.answer}</p>
                                <div className="mt-3">
                                    <span className="badge bg-primary me-2">Box {card.box}</span>
                                    <small className="text-muted">
                                        Next Review: {new Date(card.nextReviewDate).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {flashcards.length === 0 && (
                <div className="text-center mt-4">
                    <p>No flashcards created yet.</p>
                    <Link to="/create-flashcard" className="btn btn-primary">
                        Create Your First Flashcard
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AllFlashcards;