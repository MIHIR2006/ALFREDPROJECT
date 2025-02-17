import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';

const Settings = () => {
  const { auth } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Update the API endpoint to match your backend route
      await api.put(`auth/users/${auth.userId}/password`, {
        oldPassword,
        newPassword
      });

      // Clear form and show success message
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <label htmlFor="oldPassword" className="form-label">Current Password</label>
        <input
          type="password"
          className="form-control"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Update Password
      </button>
    </form>
  );
};

export default Settings;