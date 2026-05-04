import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AdviceCard from '../components/AdviceCard';
import './PostDetailPage.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [adviceText, setAdviceText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [adviceError, setAdviceError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      setError('Post not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleAdviceSubmit = async (e) => {
    e.preventDefault();
    if (adviceText.trim().length < 5) {
      setAdviceError('Advice must be at least 5 characters.');
      return;
    }
    setSubmitting(true);
    setAdviceError('');
    try {
      const res = await api.post(`/advice/${id}`, { text: adviceText });
      setPost((prev) => ({
        ...prev,
        advices: [res.data, ...prev.advices],
      }));
      setAdviceText('');
      setSuccess('Your advice has been posted! 🎉');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setAdviceError(err.response?.data?.message || 'Failed to submit advice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (error) return (
    <div className="page container" style={{ paddingTop: 60 }}>
      <div className="alert alert-error">{error}</div>
      <Link to="/" className="btn btn-ghost" style={{ marginTop: 16 }}>← Back to Feed</Link>
    </div>
  );

  const isOwner = user && post.author && !post.isAnonymous && user.name === post.author.name;
  const sortedAdvice = [...(post.advices || [])].sort(
    (a, b) => b.upvoteCount - a.upvoteCount || new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Feed</Link>

        {/* Post */}
        <div className="post-detail-card animate-fade-in-up">
          <div className="post-detail-header">
            <span className={`badge ${post.isAnonymous ? 'badge-anon' : 'badge-user'}`}>
              {post.isAnonymous ? '👤 Anonymous' : `✨ ${post.author?.name}`}
            </span>
            <span className="post-detail-date">{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <p className="post-detail-desc">{post.description}</p>

          {isOwner && (
            <div className="post-detail-actions">
              <button id="btn-delete-post" onClick={handleDelete} className="btn btn-danger btn-sm">
                🗑 Delete Post
              </button>
            </div>
          )}
        </div>

        {/* Advice Section */}
        <div className="advice-section">
          <h2 className="advice-section-title">
            💬 {sortedAdvice.length} {sortedAdvice.length === 1 ? 'Response' : 'Responses'}
          </h2>

          {/* Submit Advice */}
          {user ? (
            <form onSubmit={handleAdviceSubmit} className="advice-form-box">
              <h3 className="advice-form-heading">Share Your Advice</h3>
              {adviceError && <div className="alert alert-error">{adviceError}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <textarea
                id="advice-input"
                className="form-textarea"
                placeholder="Write your advice here… Be kind and constructive."
                value={adviceText}
                onChange={(e) => { setAdviceText(e.target.value); setAdviceError(''); }}
                rows={4}
              />
              <button
                id="btn-submit-advice"
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Posting…' : 'Post Advice →'}
              </button>
            </form>
          ) : (
            <div className="advice-login-prompt">
              <p>
                <Link to="/login" className="auth-link" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
                  Login
                </Link>{' '}
                or{' '}
                <Link to="/signup" className="auth-link" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
                  Sign up
                </Link>{' '}
                to give advice and upvote responses.
              </p>
            </div>
          )}

          {/* Advice List */}
          <div className="advice-list">
            {sortedAdvice.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤍</div>
                <h3>No advice yet</h3>
                <p>Be the first to help out!</p>
              </div>
            ) : (
              sortedAdvice.map((a, i) => (
                <div key={a._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <AdviceCard advice={a} onUpvoteChange={fetchPost} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
