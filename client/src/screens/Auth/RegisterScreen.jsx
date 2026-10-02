import React from 'react';
import LoginScreen from './LoginScreen.jsx';

export const RegisterScreen = ({ onNavigateToLogin, onRegisterSuccess }) => {
  return (
    <LoginScreen
      onNavigateToRegister={onNavigateToLogin}
      onLoginSuccess={onRegisterSuccess}
    />
  );
};

export default RegisterScreen;
