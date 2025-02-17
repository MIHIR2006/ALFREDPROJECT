import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalCards: 0,
        dueToday: 0,
        boxCounts: [0, 0, 0, 0, 0],
        successRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/flashcards');
            const cards = response.data || [];

            // Calculate stats
            const today = new Date();
            const dueCards = cards.filter(card => new Date(card.nextReviewDate) <= today);
            const boxCounts = [0, 0, 0, 0, 0];

            cards.forEach(card => {
                if (card.box >= 1 && card.box <= 5) {
                    boxCounts[card.box - 1]++;
                }
            });

            setStats({
                totalCards: cards.length,
                dueToday: dueCards.length,
                boxCounts,
                successRate: calculateSuccessRate(cards)
            });
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const calculateSuccessRate = (cards) => {
        if (!cards.length) return 0;

        // Calculate weighted success based on box levels
        const totalPossibleScore = cards.length * 5; // max box is 5
        const currentScore = cards.reduce((sum, card) => sum + card.box, 0);

        return Math.round((currentScore / totalPossibleScore) * 100);
    };
    if (loading) {
        return <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <div className="container mt-4">
            {location.state?.message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {location.state.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Welcome back, {auth.username}!</h2>
                </div>
                <div className="col-md-6 text-md-end d-flex justify-content-end gap-4">
                    {stats.dueToday > 0 && (
                        <Link to="/review" className="btn btn-success">
                            <i className="bi bi-play-circle me-1"></i>
                            Start Review ({stats.dueToday})
                        </Link>
                    )}
                    <Link to="/create-flashcard" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-1"></i>
                        Create Flashcard
                    </Link>
                    <Link to="/all-flashcards" className="btn btn-info">
                        <i className="bi bi-card-list me-1"></i>
                        View All Cards
                    </Link>
                </div>
            </div>

            <div className="row g-4">
                {/* Statistics Cards */}
                <div className="col-md-6 col-lg-3">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Cards</h5>
                            <p className="card-text display-4">{stats.totalCards}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Due Today</h5>
                            <p className="card-text display-4">{stats.dueToday}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Success Rate</h5>
                            <p className="card-text display-4">{stats.successRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Mastered</h5>
                            <p className="card-text display-4">{stats.boxCounts[4]}</p>
                        </div>
                    </div>
                </div>

                {/* Box Distribution */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Learning Progress</h5>
                            <div className="progress" style={{ height: '2rem' }}>
                                {stats.boxCounts.map((count, index) => (
                                    <div
                                        key={index}
                                        className={`progress-bar bg-${index === 4 ? 'success' :
                                            index === 0 ? 'danger' : 'warning'}`}
                                        style={{
                                            width: `${(count / stats.totalCards) * 100}%`,
                                            opacity: 0.6 + (index * 0.1)
                                        }}
                                        title={`Box ${index + 1}: ${count} cards`}
                                    >
                                        Box {index + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-muted">
                                <small>Box distribution showing your learning progress</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;