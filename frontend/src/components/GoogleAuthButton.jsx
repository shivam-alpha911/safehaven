import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './GoogleAuthButton.css';

// Your Google Client ID — get it from https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleAuthButton = ({ onError }) => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await api.post('/auth/google', { credential: response.credential });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed. Please try again.';
      onError?.(msg);
    }
  }, [login, navigate, onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          {
            theme: 'filled_black',
            size: 'large',
            shape: 'rectangular',
            width: 368,
            text: 'continue_with',
            logo_alignment: 'left',
          }
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, [handleCredentialResponse]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="google-btn-missing">
        <span>⚙️</span>
        <span>Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> to enable Google login</span>
      </div>
    );
  }

  return (
    <div className="google-btn-wrap">
      <div id="google-signin-btn" />
    </div>
  );
};

export default GoogleAuthButton;
