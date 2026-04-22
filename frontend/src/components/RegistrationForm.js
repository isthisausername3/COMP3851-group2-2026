import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm = ({ onRegisterSuccess }) => {
  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Message state
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Send data to Python backend
      const response = await axios.post('http://localhost:5000/api/register', formData);
      
      if (response.data.success) {
        setMessage({ text: response.data.message, type: 'success' });
        // Clear form on success
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
        
        // Call the callback after 1.5 seconds to redirect to login
        if (onRegisterSuccess) {
          setTimeout(() => {
            onRegisterSuccess();
          }, 1500);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
          setMessage({ text: 'Please fix the errors below', type: 'error' });
        } else {
          setMessage({ text: error.response.data.message || 'Registration failed', type: 'error' });
        }
      } else {
        setMessage({ text: 'Cannot connect to server. Make sure backend is running on port 5000', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Create Account</h2>
        <p className="subtitle">Join us today!</p>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username (min 3 characters)"
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (min 6 characters)"
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className={errors.confirmPassword ? 'error-input' : ''}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;