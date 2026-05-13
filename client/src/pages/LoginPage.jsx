import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faEye, faEyeSlash, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      signIn(data.user);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <FontAwesomeIcon icon={faPlane} />
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your SkyLine account</p>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label" htmlFor="login-username">Username</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f5f5f7', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: '8px 0 0 8px' }}>
                <FontAwesomeIcon icon={faUser} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }} />
              </span>
              <input
                id="login-username"
                name="username"
                type="text"
                className="form-control"
                style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label" htmlFor="login-password">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#f5f5f7', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: '8px 0 0 8px' }}>
                <FontAwesomeIcon icon={faLock} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }} />
              </span>
              <input
                id="login-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-control"
                style={{ borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setShowPwd(s => !s)}
                style={{ background: '#f5f5f7', border: '1.5px solid var(--border)', borderLeft: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" />
        <p className="text-center" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
