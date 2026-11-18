import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both Admin ID and Password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username.trim(), password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          Glowroot<span>.</span>
        </div>
        <div className="admin-login-sub">ADMINISTRATOR PORTAL</div>

        <div
          style={{
            background: 'var(--color-ivory)',
            border: '1px solid var(--color-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1rem',
            marginBottom: '1.75rem',
            fontSize: '0.82rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-champagne-gold)', fontWeight: 600, marginBottom: '2px' }}>
            <ShieldCheck size={14} />
            <span>Authorized Access Only</span>
          </div>
          Restricted management portal for authorized administrator only.
        </div>

        {error && (
          <div
            style={{
              background: '#FFEBEE',
              border: '1px solid #FFCDD2',
              color: '#C62828',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label" htmlFor="username">
              <User size={14} />
              <span>Admin ID / Username</span>
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Enter your Admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">
              <Lock size={14} />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.95rem' }}
            disabled={loading}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>
            ← Return to Glowroot Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
