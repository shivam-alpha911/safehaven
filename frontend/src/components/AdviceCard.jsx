import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AdviceCard.css';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AdviceCard = ({ advice, onUpvoteChange }) => {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(advice.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(
    user ? advice.upvotes?.some((id) => id === user.id || id?.toString() === user.id) : false
  );
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!user || loading) return;
    setLoading(true);
    try {
      const res = await api.put(`/advice/${advice._id}/upvote`);
      setUpvoteCount(res.data.upvoteCount);
      setHasUpvoted(res.data.hasUpvoted);
      if (onUpvoteChange) onUpvoteChange();
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advice-card animate-fade-in-up" id={`advice-${advice._id}`}>
      <div className="advice-card-header">
        <div className="advice-author">
          <div className="advice-avatar">
            {advice.author?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <span className="advice-author-name">{advice.author?.name || 'Unknown'}</span>
            <span className="advice-date">{formatDate(advice.createdAt)}</span>
          </div>
        </div>
        <button
          id={`upvote-${advice._id}`}
          className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''} ${!user ? 'disabled' : ''}`}
          onClick={handleUpvote}
          disabled={loading || !user}
          title={user ? (hasUpvoted ? 'Remove upvote' : 'Upvote this advice') : 'Login to upvote'}
        >
          <span className="upvote-icon">▲</span>
          <span className="upvote-count">{upvoteCount}</span>
        </button>
      </div>
      <p className="advice-text">{advice.text}</p>
    </div>
  );
};

export default AdviceCard;
