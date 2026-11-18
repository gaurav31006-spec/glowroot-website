import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Image,
  Sparkles,
  FileEdit,
  ExternalLink,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats } from '../services/api';
import '../styles/admin.css';

const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuickStats();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchQuickStats = async () => {
    try {
      const res = await getAdminStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching admin quick stats:', e);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-ivory)',
          color: 'var(--color-champagne-gold)',
        }}
      >
        <Sparkles size={36} className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="admin-layout-root">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand-area">
            <Link to="/admin/dashboard" className="admin-brand-title">
              Glowroot<span>.</span>
            </Link>
            <span className="admin-portal-badge">Admin Portal</span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <User size={14} color="var(--color-champagne-gold)" />
              <span>Signed in as <strong>{admin?.username || 'Ishita'}</strong></span>
            </div>
          </div>

          <div className="admin-actions">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="action-icon-btn"
              title="Open public website in new tab"
            >
              <ExternalLink size={15} />
              <span>View Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="action-icon-btn danger"
              title="Logout from admin session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Navigation Bar */}
      <nav className="admin-nav-bar">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) => `admin-nav-tab ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) => `admin-nav-tab ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={18} />
          <span>Booking Requests</span>
          {stats?.pendingBookings > 0 && (
            <span className="admin-tab-badge">{stats.pendingBookings}</span>
          )}
        </NavLink>

        <NavLink
          to="/admin/portfolio"
          className={({ isActive }) => `admin-nav-tab ${isActive ? 'active' : ''}`}
        >
          <Image size={18} />
          <span>Portfolio Gallery</span>
        </NavLink>

        <NavLink
          to="/admin/services"
          className={({ isActive }) => `admin-nav-tab ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={18} />
          <span>Services</span>
        </NavLink>

        <NavLink
          to="/admin/content"
          className={({ isActive }) => `admin-nav-tab ${isActive ? 'active' : ''}`}
        >
          <FileEdit size={18} />
          <span>Website Content & About</span>
        </NavLink>
      </nav>

      {/* Main Content View */}
      <main className="admin-content-wrap">
        <Outlet context={{ stats, refreshStats: fetchQuickStats }} />
      </main>
    </div>
  );
};

export default AdminLayout;
