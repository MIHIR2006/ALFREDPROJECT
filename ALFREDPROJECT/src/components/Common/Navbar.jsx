import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Flashcard App
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {auth.token && (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                    to="/dashboard"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {auth.token ? (
                            <>
                                <li className="nav-item d-flex align-items-center">
                                    <Link
                                        className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                        to="/profile"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                    to="/login"
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;