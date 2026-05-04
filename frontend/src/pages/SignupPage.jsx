import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import GoogleAuthButton from '../components/GoogleAuthButton';
import './AuthPages.css';

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">✨</div>
          <h1 className="auth-title">Join the exchange</h1>
          <p className="auth-subtitle">A safe space to speak freely and be heard</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Google Sign-Up */}
        <GoogleAuthButton onError={setError} />

        <div className="auth-divider">or sign up with email</div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">Your name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="How should we call you?"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
              minLength={2}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Email address</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button
            id="btn-signup-submit"
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Login →</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
