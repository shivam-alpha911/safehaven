import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CreatePostPage.css';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', isAnonymous: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (form.description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/posts', form);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
      setLoading(false);
    }
  };

  const charLeft = 2000 - form.description.length;

  return (
    <div className="page">
      <div className="container">
        <div className="create-post-wrap animate-fade-in-up">
          <div className="create-post-header">
            <div className="create-post-icon-wrap">📝</div>
            <p className="create-post-eyebrow">Share Anonymously or Publicly</p>
            <h1 className="page-title">What's on your mind?</h1>
            <p className="page-subtitle">
              Open up to the community — be as detailed as you like.
              The more you share, the better advice you'll receive.
            </p>
          </div>

          <div className="create-post-card">
            {error && (
              <div className="alert alert-error" style={{ marginBottom: 22 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <label htmlFor="post-title" className="form-label">Title</label>
                <input
                  id="post-title"
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Sum up your situation in one line…"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  autoFocus
                />
                <span className="char-counter">{150 - form.title.length} remaining</span>
              </div>

              <div className="form-group">
                <label htmlFor="post-description" className="form-label">Description</label>
                <textarea
                  id="post-description"
                  name="description"
                  className="form-textarea"
                  placeholder="Tell us more — what happened, how you feel, what you've tried… The community is here to listen."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  maxLength={2000}
                />
                <span className={`char-counter ${charLeft < 100 ? 'char-warn' : ''}`}>
                  {charLeft} characters remaining
                </span>
              </div>

              <div className="anon-toggle">
                <label className="anon-toggle-label" htmlFor="post-anonymous">
                  <div className="anon-toggle-content">
                    <div className="anon-toggle-icon-wrap">👤</div>
                    <div>
                      <span className="anon-toggle-title">Post Anonymously</span>
                      <span className="anon-toggle-desc">
                        Your name stays hidden from everyone
                      </span>
                    </div>
                  </div>
                  <div className={`toggle-switch ${form.isAnonymous ? 'on' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </label>
                <input
                  id="post-anonymous"
                  type="checkbox"
                  name="isAnonymous"
                  checked={form.isAnonymous}
                  onChange={handleChange}
                  className="sr-only"
                />
              </div>

              {form.isAnonymous && (
                <div className="anon-note">
                  🔒 Your real identity is securely stored but completely hidden from all users. You'll appear as "Anonymous".
                </div>
              )}

              <button
                id="btn-create-post"
                type="submit"
                className="btn btn-primary btn-lg create-submit-btn"
                disabled={loading}
              >
                {loading ? 'Posting…' : 'Post to Community →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
