import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setMessage({ text: response.data.message, type: 'success' });
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
        setFormData({ email: '', password: '' });
        setErrors({});
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setMessage({ text: error.response.data.message || 'Login failed', type: 'error' });
        }
      } else {
        setMessage({ text: 'Cannot connect to server', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-options">
          <label className="checkbox">
            <input type="checkbox" /> Remember me
          </label>
          <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;