import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Shows a full-page loader while auth resolves, then guards the route. */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-wrap" style={{ minHeight: '100vh' }}>
        <div className="spin-ring" />
        <span>Loading…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
}
