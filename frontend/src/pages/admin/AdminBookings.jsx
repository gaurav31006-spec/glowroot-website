import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit3,
  FileText,
  MessageCircle,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { getBookings, updateBookingStatus, deleteBooking } from '../../services/api';
import Toast from '../../components/Toast';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Completed', 'Rejected'];

const AdminBookings = () => {
  const { refreshStats } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [privateNotesText, setPrivateNotesText] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchBookingsList();
  }, [statusFilter, dateFilter]);

  const fetchBookingsList = async () => {
    try {
      setLoading(true);
      const res = await getBookings({
        status: statusFilter,
        date: dateFilter,
        search: searchQuery,
      });
      if (res.data?.success) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookingsList();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateBookingStatus(id, { status });
      if (res.data?.success) {
        setToastMessage(`Booking updated to ${status}.`);
        setToastType('success');
        fetchBookingsList();
        if (refreshStats) refreshStats();
        if (selectedBooking && (selectedBooking._id === id || selectedBooking.id === id)) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      }
    } catch (e) {
      setToastMessage('Failed to update booking status.');
      setToastType('error');
    }
  };

  const openNotesModal = (booking) => {
    setSelectedBooking(booking);
    setPrivateNotesText(booking.privateNotes || '');
    setNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    try {
      const id = selectedBooking._id || selectedBooking.id;
      const res = await updateBookingStatus(id, { privateNotes: privateNotesText });
      if (res.data?.success) {
        setToastMessage('Private notes saved successfully.');
        setToastType('success');
        setNotesModalOpen(false);
        fetchBookingsList();
      }
    } catch (e) {
      setToastMessage('Failed to save notes.');
      setToastType('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking enquiry?')) return;
    try {
      const res = await deleteBooking(id);
      if (res.data?.success) {
        setToastMessage('Booking deleted successfully.');
        setToastType('success');
        fetchBookingsList();
        if (refreshStats) refreshStats();
        if (selectedBooking) setSelectedBooking(null);
      }
    } catch (e) {
      setToastMessage('Failed to delete booking.');
      setToastType('error');
    }
  };

  return (
    <div className="admin-bookings-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="admin-card-header" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="section-tagline">Client Appointments</span>
          <h1 className="admin-card-title" style={{ fontSize: '2rem' }}>
            Booking Management
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Manage bridal appointment enquiries, confirm dates, reject conflicts, and add private notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-gold-border)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`filter-tab-btn ${statusFilter === st ? 'active' : ''}`}
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.82rem' }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Date Filter & Search Input */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter by specific event date"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              style={{ fontSize: '0.8rem', color: 'var(--color-dusty-rose)' }}
            >
              Clear Date
            </button>
          )}

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search bride, phone, venue..."
              className="form-input"
              style={{ width: '220px', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Service</th>
                <th>Event Date & Time</th>
                <th>Venue / Location</th>
                <th>Contact Details</th>
                <th>Status</th>
                <th>Private Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-champagne-gold)' }} />
                    <p>Loading bookings...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {b.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Submitted: {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge-gold">{b.service}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--color-champagne-gold)" />
                        <span>{b.eventDate}</span>
                      </div>
                      {b.eventTime && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                          <Clock size={12} />
                          <span>{b.eventTime}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--color-dusty-rose)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{b.eventLocation}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{b.mobileNumber}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{b.email}</div>
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
                      {b.privateNotes ? (
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-text-secondary)',
                            maxWidth: '160px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={b.privateNotes}
                        >
                          {b.privateNotes}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                          No notes
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="action-icon-btn"
                          title="View Full Booking Details"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() => openNotesModal(b)}
                          className="action-icon-btn"
                          title="Add / Edit Private Notes"
                        >
                          <FileText size={14} />
                        </button>

                        {b.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(b._id || b.id, 'Approved')}
                            className="action-icon-btn success"
                            title="Approve booking"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {b.status !== 'Completed' && b.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(b._id || b.id, 'Completed')}
                            className="action-icon-btn"
                            title="Mark Completed"
                          >
                            <CalendarCheck size={14} color="#1565C0" />
                          </button>
                        )}

                        {b.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(b._id || b.id, 'Rejected')}
                            className="action-icon-btn danger"
                            title="Reject booking"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${b.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${b.fullName}, this is Ishita from Glowroot regarding your enquiry for ${b.service} on ${b.eventDate}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon-btn"
                          title="WhatsApp Client"
                        >
                          <MessageCircle size={14} />
                        </a>

                        <button
                          onClick={() => handleDelete(b._id || b.id)}
                          className="action-icon-btn danger"
                          title="Delete enquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedBooking && !notesModalOpen && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span className="section-tagline">Client Information</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>
                  {selectedBooking.fullName}
                </h2>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                  <a href={`tel:${selectedBooking.mobileNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="var(--color-champagne-gold)" />
                    <span>{selectedBooking.mobileNumber}</span>
                  </a>
                  <a href={`mailto:${selectedBooking.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} color="var(--color-champagne-gold)" />
                    <span>{selectedBooking.email}</span>
                  </a>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--color-ivory)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-gold-border)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Service</span>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedBooking.service}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</span>
                    <div>
                      <span className={`status-pill status-${selectedBooking.status.toLowerCase()}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Event Date</span>
                    <div style={{ fontWeight: 600 }}>{selectedBooking.eventDate}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Ready Time</span>
                    <div>{selectedBooking.eventTime || 'Not specified'}</div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Venue / Location</span>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                    {selectedBooking.eventLocation}
                  </div>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--color-text-primary)' }}>
                    Client's Special Notes / Requests:
                  </h4>
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #E0D7CD',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    "{selectedBooking.message}"
                  </div>
                </div>
              )}

              {selectedBooking.privateNotes && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--color-text-primary)' }}>
                    Ishita's Private Admin Notes:
                  </h4>
                  <div
                    style={{
                      background: 'var(--color-dusty-rose-soft)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {selectedBooking.privateNotes}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking._id || selectedBooking.id, 'Approved')}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <CheckCircle size={15} />
                  <span>Approve Date</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking._id || selectedBooking.id, 'Completed')}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <span>Mark Completed</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedBooking._id || selectedBooking.id, 'Rejected')}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Notes Edit Modal */}
      {notesModalOpen && selectedBooking && (
        <div className="modal-overlay" onClick={() => setNotesModalOpen(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Private Admin Notes</h3>
              <button onClick={() => setNotesModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Add internal notes for <strong>{selectedBooking.fullName}</strong>'s booking (only visible to Ishita).
            </p>

            <textarea
              className="form-textarea"
              placeholder="e.g. Trial scheduled on 12th Dec; client requested soft Hollywood waves; lehenga color is pastel mint..."
              value={privateNotesText}
              onChange={(e) => setPrivateNotesText(e.target.value)}
              style={{ minHeight: '140px', marginBottom: '1.5rem' }}
            ></textarea>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setNotesModalOpen(false)} className="btn btn-secondary">
                <span>Cancel</span>
              </button>
              <button onClick={handleSaveNotes} className="btn btn-primary">
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
