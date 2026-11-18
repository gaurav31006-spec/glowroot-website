import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User,
  MapPin,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../../services/api';
import Toast from '../../components/Toast';

const AdminDashboard = () => {
  const { stats, refreshStats } = useOutletContext();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();
      if (res.data?.success) {
        setRecentBookings(res.data.data.slice(0, 5));
      }
    } catch (e) {
      console.error('Error fetching recent bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateBookingStatus(id, { status });
      if (res.data?.success) {
        setToastMessage(`Booking status updated to ${status}.`);
        setToastType('success');
        fetchRecentBookings();
        if (refreshStats) refreshStats();
      }
    } catch (e) {
      setToastMessage('Failed to update booking status.');
      setToastType('error');
    }
  };

  return (
    <div className="admin-dashboard-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, var(--color-ivory) 100%)',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-serif-accent)',
              fontSize: '1rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-champagne-gold)',
              fontWeight: 600,
            }}
          >
            Studio Management
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '4px' }}>
            Welcome back, Ishita
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Here is what's happening across your bridal appointments and portfolio today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/bookings" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <CalendarCheck size={16} />
            <span>Review Bookings ({stats?.pendingBookings || 0})</span>
          </Link>
          <Link to="/admin/portfolio" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
            <ImageIcon size={16} />
            <span>Add Work</span>
          </Link>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="stats-grid">
        {/* Total Bookings */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--color-dusty-rose-soft)', color: 'var(--color-dusty-rose)' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="stat-num">{stats?.totalBookings ?? 0}</div>
            <div className="stat-label">Total Enquiries</div>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#FFF8E1', color: '#B78103' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-num">{stats?.pendingBookings ?? 0}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>

        {/* Approved */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-num">{stats?.approvedBookings ?? 0}</div>
            <div className="stat-label">Confirmed Dates</div>
          </div>
        </div>

        {/* Total Portfolio Images */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--color-powder-blue)', color: '#4A7A9B' }}>
            <ImageIcon size={24} />
          </div>
          <div>
            <div className="stat-num">{stats?.totalPortfolioImages ?? 0}</div>
            <div className="stat-label">Portfolio Photographs</div>
          </div>
        </div>

        {/* Total Services */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--color-gold-subtle)', color: '#8C6A28' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-num">{stats?.totalServices ?? 0}</div>
            <div className="stat-label">Active Services</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Recent Appointment Enquiries</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Showing the latest client booking enquiries received.
            </p>
          </div>
          <Link to="/admin/bookings" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <span>Manage All Bookings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Service Requested</th>
                <th>Event Date & Venue</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    No booking requests yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {b.fullName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Enquired: {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge-gold">{b.service}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                        <Calendar size={13} color="var(--color-champagne-gold)" />
                        <span>{b.eventDate}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                        <MapPin size={12} />
                        <span>{b.eventLocation}</span>
                      </div>
                    </td>
                    <td>
                      <div>{b.mobileNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.email}</div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          b.status === 'Approved'
                            ? 'status-approved'
                            : b.status === 'Pending'
                            ? 'status-pending'
                            : b.status === 'Completed'
                            ? 'status-completed'
                            : 'status-rejected'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(b._id || b.id, 'Approved')}
                            className="action-icon-btn success"
                            title="Approve booking"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve</span>
                          </button>
                        )}
                        <a
                          href={`https://wa.me/${b.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${b.fullName}, this is Ishita from Glowroot regarding your bridal booking enquiry for ${b.eventDate}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon-btn"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
