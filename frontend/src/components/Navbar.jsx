import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-mark">
            <img src="/logo.png" alt="STRANGR Anonymous logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          </div>
          <span className="navbar-logo-text">
            STRANGR<em>Anonymous</em>
          </span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            <span className="navbar-link-icon">✦</span> Feed
          </Link>
          {user && (
            <>
              <Link to="/create" className={`navbar-link ${isActive('/create') ? 'active' : ''}`}>
                <span className="navbar-link-icon">＋</span> Post
              </Link>
              <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <span className="navbar-link-icon">◈</span> Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="navbar-username">{user.name}</span>
              <button id="btn-logout" onClick={handleLogout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started →</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
