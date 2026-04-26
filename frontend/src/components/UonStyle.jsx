// LoginFormStyled.jsx - This doesn't replace anything
import React from 'react';
import './LoginForm.css';
import OriginalLoginForm from './LoginForm';

const LoginFormStyled = (props) => {
  return (
    <div className="uon-login-container">
      <div className="uon-brand-section">
        {/* Branding content */}
      </div>
      <div className="uon-form-section">
        <OriginalLoginForm {...props} /> {/* working form */}
      </div>
    </div>
  );
};

export default LoginFormStyled;