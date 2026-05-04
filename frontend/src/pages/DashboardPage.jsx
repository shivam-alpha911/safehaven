import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './DashboardPage.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ posts: [], advice: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Profile Header */}
        <div className="dash-profile animate-fade-in-up">
          <div className="dash-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="dash-profile-info">
            <h1 className="dash-name">{user?.name}</h1>
            <p className="dash-email">{user?.email}</p>
            <div className="dash-stats">
              <div className="dash-stat">
                <span className="dash-stat-value">{data.posts.length}</span>
                <span className="dash-stat-label">Problems Shared</span>
              </div>
              <div className="dash-stat-divider" />
              <div className="dash-stat">
                <span className="dash-stat-value">{data.advice.length}</span>
                <span className="dash-stat-label">Advice Given</span>
              </div>
              <div className="dash-stat-divider" />
              <div className="dash-stat">
                <span className="dash-stat-value">
                  {data.advice.reduce((acc, a) => acc + a.upvoteCount, 0)}
                </span>
                <span className="dash-stat-label">Total Upvotes</span>
              </div>
            </div>
          </div>
          <Link to="/create" id="btn-dash-post" className="btn btn-primary">
            + Share Problem
          </Link>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            id="tab-posts"
            className={`dash-tab ${tab === 'posts' ? 'active' : ''}`}
            onClick={() => setTab('posts')}
          >
            📝 My Posts ({data.posts.length})
          </button>
          <button
            id="tab-advice"
            className={`dash-tab ${tab === 'advice' ? 'active' : ''}`}
            onClick={() => setTab('advice')}
          >
            💬 Advice Given ({data.advice.length})
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="dash-content animate-fade-in">
            {/* Posts Tab */}
            {tab === 'posts' && (
              <div className="dash-list">
                {data.posts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No posts yet</h3>
                    <p>Share your first problem with the community!</p>
                    <Link to="/create" className="btn btn-primary" style={{ marginTop: 16 }}>
                      Create Post
                    </Link>
                  </div>
                ) : (
                  data.posts.map((post, i) => (
                    <Link
                      key={post._id}
                      to={`/posts/${post._id}`}
                      id={`dash-post-${post._id}`}
                      className="dash-item animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="dash-item-main">
                        <div className="dash-item-header">
                          <span className={`badge ${post.isAnonymous ? 'badge-anon' : 'badge-user'}`}>
                            {post.isAnonymous ? '👤 Anonymous' : '✨ Public'}
                          </span>
                          <span className="dash-item-date">{formatDate(post.createdAt)}</span>
                        </div>
                        <h3 className="dash-item-title">{post.title}</h3>
                        <p className="dash-item-excerpt">
                          {post.description.slice(0, 120)}{post.description.length > 120 ? '…' : ''}
                        </p>
                      </div>
                      <div className="dash-item-meta">
                        <span className="dash-item-count">💬 {post.adviceCount}</span>
                        <span className="dash-item-arrow">→</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Advice Tab */}
            {tab === 'advice' && (
              <div className="dash-list">
                {data.advice.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>No advice given yet</h3>
                    <p>Browse the feed and help someone today!</p>
                    <Link to="/" className="btn btn-ghost" style={{ marginTop: 16 }}>
                      Browse Feed
                    </Link>
                  </div>
                ) : (
                  data.advice.map((item, i) => (
                    <Link
                      key={item._id}
                      to={`/posts/${item.post?._id}`}
                      id={`dash-advice-${item._id}`}
                      className="dash-item animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="dash-item-main">
                        <div className="dash-item-header">
                          <span className="dash-item-on">On: </span>
                          <span className="dash-item-post-title">{item.post?.title || 'Deleted Post'}</span>
                          <span className="dash-item-date">{formatDate(item.createdAt)}</span>
                        </div>
                        <p className="dash-item-excerpt">
                          "{item.text.slice(0, 140)}{item.text.length > 140 ? '…' : ''}"
                        </p>
                      </div>
                      <div className="dash-item-meta">
                        <span className="dash-item-count">▲ {item.upvoteCount}</span>
                        <span className="dash-item-arrow">→</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
