import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ClickSoundEffect from './components/ClickSoundEffect';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import DashboardPage from './pages/DashboardPage';

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

// Redirect unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <ClickSoundEffect />
      <Navbar />
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route
          path="/login"
          element={<GuestRoute><LoginPage /></GuestRoute>}
        />
        <Route
          path="/signup"
          element={<GuestRoute><SignupPage /></GuestRoute>}
        />
        <Route
          path="/create"
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
