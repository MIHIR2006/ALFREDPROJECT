import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Settings from './Settings';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>User Profile</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowSettings(!showSettings)}
            >
              <i className="bi bi-gear me-2"></i>
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Profile Information</h3>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Username:</div>
                <div className="col-md-8">{auth.username}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Email:</div>
                <div className="col-md-8">{auth.email}</div>
              </div>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title mb-4">Settings</h3>
                <Settings />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;