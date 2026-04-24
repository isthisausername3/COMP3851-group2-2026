import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import WelcomePage from './components/WelcomePage';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'welcome'
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in on page load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/check-auth`, {
        withCredentials: true
      });
      if (response.data.authenticated) {
        setCurrentUser(response.data.user);
        setCurrentPage('welcome');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('welcome');
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/logout`, {}, {
        withCredentials: true
      });
      setCurrentUser(null);
      setCurrentPage('login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRegisterSuccess = () => {
    // After registration, redirect to login
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-brand">Auth System</div>
        <div className="nav-links">
          {currentPage !== 'welcome' && (
            <>
              <button 
                className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentPage('login')}
              >
                Login
              </button>
              <button 
                className={`nav-link ${currentPage === 'register' ? 'active' : ''}`}
                onClick={() => setCurrentPage('register')}
              >
                Register
              </button>
            </>
          )}
          {currentPage === 'welcome' && (
            <span className="user-greeting">Hello, {currentUser?.username}!</span>
          )}
        </div>
      </nav>

      {/* Page Content */}
      {currentPage === 'login' && (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentPage === 'register' && (
        <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
      )}
      
      {currentPage === 'welcome' && (
        <WelcomePage user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
