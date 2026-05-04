import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import './FeedPage.css';

/* ── Helpers ─────────────────────────────────────────── */
const pluralStory = (n) => `${n} ${n === 1 ? 'story' : 'stories'}`;

/* ── Lazy Spline loader — only mounts iframe after user interacts ── */
const SplineBackground = memo(() => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Load immediately when hero enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLoaded(true); observer.disconnect(); } },
      { threshold: 0.01 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="spline-bg-wrap">
      {loaded && (
        <iframe
          src="https://my.spline.design/xmaskcopycopy-TVcMWlgk6QYMOeb4H5DM2hZ0-Zd5/"
          frameBorder="0"
          className="spline-bg"
          title="Spline 3D Background"
          allow="autoplay"
        />
      )}
      {/* Covers "Built with Hana" badge — bottom-left AND bottom-right */}
      <div className="spline-cover spline-cover-bl" />
      <div className="spline-cover spline-cover-br" />
      {/* Full bottom bar for any lingering badges */}
      <div className="spline-cover spline-cover-bottom" />
    </div>
  );
});
SplineBackground.displayName = 'SplineBackground';

/* ── Hero (memoised — never re-renders from search state) ── */
const HeroSection = memo(({ postCount }) => (
  <section className="feed-hero">
    <SplineBackground />

    {/* Dark overlay so text is readable */}
    <div className="hero-overlay" />

    {/* Colour blobs */}
    <div className="hero-blob hero-blob-1" />
    <div className="hero-blob hero-blob-2" />

    {/* Centred content */}
    <div className="container hero-inner">
      <div className="hero-copy animate-fade-in-up">
        <div className="hero-eyebrow">
          <span className="glow-dot" />
          <span>Anonymous &amp; Judgment-Free</span>
        </div>

        <h1 className="hero-title">
          Share your story.<br />
          <span className="gradient-text-animated">Get real advice.</span>
        </h1>

        <p className="hero-desc">
          SafeHaven — a place where you can speak freely and be truly heard.
          Post anonymously, receive genuine advice, and heal together.
        </p>

        <div className="hero-cta">
          <Link to="/create" id="btn-hero-post" className="btn btn-primary btn-xl">
            Share a Problem <span className="btn-arrow">→</span>
          </Link>
          <Link to="/signup" className="btn btn-ghost btn-lg hero-secondary-btn">
            Join Free
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">{postCount}</span>
            <span className="hero-stat-label">Stories shared</span>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">Anonymous</span>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <span className="hero-stat-num">∞</span>
            <span className="hero-stat-label">Empathy</span>
          </div>
        </div>
      </div>
    </div>

    <div className="hero-scroll-hint">
      <div className="hero-scroll-dot" />
      <span>Scroll</span>
    </div>
  </section>
));
HeroSection.displayName = 'HeroSection';

/* ── Empty state ── */
const EmptyState = memo(({ search }) => (
  <div className="empty-state animate-fade-in-up">
    <img src="/mascot.png" alt="No posts yet" className="empty-img" loading="lazy" />
    <h3>{search ? 'No matching stories found' : 'No stories yet'}</h3>
    <p>{search ? 'Try different keywords.' : 'Be the first to open up to the community!'}</p>
    {!search && (
      <Link to="/create" className="btn btn-primary" style={{ marginTop: 20 }}>
        Share your story →
      </Link>
    )}
  </div>
));
EmptyState.displayName = 'EmptyState';

/* ── FeedPage ── */
const FeedPage = () => {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/posts')
      .then((res)  => { if (!cancelled) setPosts(res.data); })
      .catch(()    => { if (!cancelled) setError('Failed to load posts. Is the server running?'); })
      .finally(()  => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? posts.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        )
      : posts;
  }, [posts, search]);

  const clearSearch = useCallback(() => setSearch(''), []);

  return (
    <div className="feed-root">
      <HeroSection postCount={posts.length} />

      {/* ── Feed ── */}
      <div className="container feed-section">
        <div className="feed-header">
          <div className="feed-header-left">
            <h2 className="feed-section-title">Community Feed</h2>
            <p className="feed-section-sub">
              {loading ? 'Loading…' : `${pluralStory(filtered.length)} need your wisdom`}
            </p>
          </div>

          <div className="feed-search-wrap">
            <span className="feed-search-icon">⌕</span>
            <input
              id="feed-search"
              type="text"
              className="feed-search"
              placeholder="Search stories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="feed-search-clear" onClick={clearSearch} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>

        {loading && <div className="spinner" />}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 28 }}>
            <span>⚠️</span>{error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && <EmptyState search={search} />}

        <div className="posts-grid">
          {filtered.map((post, i) => (
            <PostCard key={post._id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
