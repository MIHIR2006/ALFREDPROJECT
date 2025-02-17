import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';


const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    applyTheme(savedMode);
  }, []);

  const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    applyTheme(newMode);
  };

  return (
    <div className="dark-mode-toggle">
      <button
        className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} rounded-circle`}
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="mode-icon">
          {darkMode ? '☀️' : '🌙'}
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;