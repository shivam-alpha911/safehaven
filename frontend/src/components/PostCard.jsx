import { memo } from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PostCard = memo(({ post, index = 0 }) => (
  <Link
    to={`/posts/${post._id}`}
    className="post-card"
    style={{ animationDelay: `${index * 0.07}s` }}
    id={`post-card-${post._id}`}
  >
    <div className="post-card-header">
      <div className="post-card-meta">
        <span className={`badge ${post.isAnonymous ? 'badge-anon' : 'badge-user'}`}>
          {post.isAnonymous ? '◉ Anonymous' : `✦ ${post.author?.name}`}
        </span>
        <span className="post-card-date">{formatDate(post.createdAt)}</span>
      </div>
      <span className="post-card-responses">
        💬 {post.adviceCount} {post.adviceCount === 1 ? 'reply' : 'replies'}
      </span>
    </div>

    <h2 className="post-card-title">{post.title}</h2>
    <p className="post-card-excerpt">{post.description}</p>

    <div className="post-card-footer">
      <span className="post-card-cta">
        Read &amp; Advise
        <span className="post-card-cta-arrow">→</span>
      </span>
    </div>
  </Link>
));

PostCard.displayName = 'PostCard';
export default PostCard;
