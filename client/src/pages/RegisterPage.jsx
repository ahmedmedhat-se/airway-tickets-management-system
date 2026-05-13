import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faEye, faEyeSlash, faEnvelope, faLock, faUser, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', fullName: '', password: '', role: 'USER' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputIcon = ({ icon }) => (
    <span className="input-group-text" style={{ background: '#f5f5f7', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: '8px 0 0 8px' }}>
      <FontAwesomeIcon icon={icon} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }} />
    </span>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FontAwesomeIcon icon={faPlane} />
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join SkyLine and start booking flights</p>

        {error && <div className="alert alert-danger mb-3">{error}</div>}
        {success && <div className="alert alert-success mb-3">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-fullName">Full Name</label>
            <div className="input-group">
              <InputIcon icon={faIdCard} />
              <input id="reg-fullName" name="fullName" type="text" className="form-control"
                style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                placeholder="Ali Ahmed" value={form.fullName} onChange={handleChange} required />
            </div>
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-username">Username</label>
            <div className="input-group">
              <InputIcon icon={faUser} />
              <input id="reg-username" name="username" type="text" className="form-control"
                style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                placeholder="ali_ahmed" value={form.username} onChange={handleChange}
                autoComplete="username" required />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <div className="input-group">
              <InputIcon icon={faEnvelope} />
              <input id="reg-email" name="email" type="email" className="form-control"
                style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                placeholder="ali@example.com" value={form.email} onChange={handleChange}
                autoComplete="email" required />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-group">
              <InputIcon icon={faLock} />
              <input id="reg-password" name="password" type={showPwd ? 'text' : 'password'}
                className="form-control"
                style={{ borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}
                placeholder="Min 8 chars, uppercase, number, symbol"
                value={form.password} onChange={handleChange}
                autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPwd(s => !s)}
                className="input-group-text"
                style={{ background: '#f5f5f7', border: '1.5px solid var(--border)', borderLeft: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}
                tabIndex={-1}>
                <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }} />
              </button>
            </div>
            <div className="form-text mt-1">Must contain uppercase, lowercase, number, and special character.</div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="form-label" htmlFor="reg-role">Account Type</label>
            <select id="reg-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
              <option value="USER">Passenger</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" />
                Creating account…
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" />
        <p className="text-center" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
