import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ user, onLogout }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          🎉
        </div>
        <h1>Welcome, {user.username}!</h1>
        <p>You have successfully logged in to your account.</p>
        
        <div className="user-info">
          <h3>Your Account Info</h3>
          <div className="info-item">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
        </div>
        
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;