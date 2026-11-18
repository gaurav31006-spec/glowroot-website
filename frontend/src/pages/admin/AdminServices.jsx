import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  UploadCloud,
  Clock,
  Eye,
  Power,
} from 'lucide-react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  uploadImage,
} from '../../services/api';
import Toast from '../../components/Toast';

const CATEGORIES = ['Bridal', 'Engagement', 'Reception', 'Cocktail', 'Party', 'Other'];

const AdminServices = () => {
  const { refreshStats } = useOutletContext();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bridal',
    shortDescription: '',
    fullDescription: '',
    startingPrice: '',
    priceNote: '',
    duration: '2.5 - 3.5 Hours',
    includes: '',
    image: '',
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchServicesList();
  }, []);

  const fetchServicesList = async () => {
    try {
      setLoading(true);
      const res = await getServices(false); // get all including inactive
      if (res.data?.success) {
        setServices(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching services:', e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      category: 'Bridal',
      shortDescription: '',
      fullDescription: '',
      startingPrice: '',
      priceNote: '',
      duration: '3.0 Hours',
      includes: 'Full luxury skin prep\nCustomized HD foundation\nBridal hair design\nDupatta draping',
      image: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setIsEditing(true);
    setCurrentId(s._id || s.id);
    setFormData({
      name: s.name || '',
      category: s.category || 'Bridal',
      shortDescription: s.shortDescription || '',
      fullDescription: s.fullDescription || '',
      startingPrice: s.startingPrice !== null ? String(s.startingPrice) : '',
      priceNote: s.priceNote || '',
      duration: s.duration || '3.0 Hours',
      includes: Array.isArray(s.includes) ? s.includes.join('\n') : '',
      image: s.image || '',
      isActive: s.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      const res = await uploadImage(data);
      if (res.data?.success) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        setToastMessage('Service photograph uploaded!');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage('Image upload failed.');
      setToastType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shortDescription.trim()) {
      setToastMessage('Service name and short description are required.');
      setToastType('error');
      return;
    }
    if (!formData.image.trim()) {
      setToastMessage('Please provide an image photograph.');
      setToastType('error');
      return;
    }

    const payload = {
      ...formData,
      startingPrice: formData.startingPrice ? Number(formData.startingPrice) : null,
      includes: formData.includes
        ? formData.includes
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEditing) {
        const res = await updateService(currentId, payload);
        if (res.data?.success) {
          setToastMessage('Service updated successfully!');
          setToastType('success');
        }
      } else {
        const res = await createService(payload);
        if (res.data?.success) {
          setToastMessage('New makeup service created!');
          setToastType('success');
        }
      }
      setModalOpen(false);
      fetchServicesList();
      if (refreshStats) refreshStats();
    } catch (err) {
      setToastMessage('Error saving service.');
      setToastType('error');
    }
  };

  const handleToggleActive = async (service) => {
    const id = service._id || service.id;
    const newStatus = !service.isActive;
    try {
      const res = await updateService(id, { isActive: newStatus });
      if (res.data?.success) {
        setToastMessage(`Service ${newStatus ? 'activated' : 'deactivated'}.`);
        setToastType('success');
        fetchServicesList();
        if (refreshStats) refreshStats();
      }
    } catch (err) {
      setToastMessage('Failed to update service status.');
      setToastType('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await deleteService(id);
      if (res.data?.success) {
        setToastMessage('Service deleted.');
        setToastType('success');
        fetchServicesList();
        if (refreshStats) refreshStats();
      }
    } catch (err) {
      setToastMessage('Failed to delete service.');
      setToastType('error');
    }
  };

  return (
    <div className="admin-services-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="admin-card-header" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="section-tagline">Service Offerings</span>
          <h1 className="admin-card-title" style={{ fontSize: '2rem' }}>
            Services Management
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Add, update pricing, descriptions, inclusions, and activate or deactivate makeup packages.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Name & Photo</th>
                <th>Category</th>
                <th>Starting Investment</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-champagne-gold)' }} />
                    <p>Loading services...</p>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    No services created yet.
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s._id || s.id} style={{ opacity: s.isActive === false ? 0.6 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={s.image}
                          alt={s.name}
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid var(--color-gold-border)',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {s.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--color-text-secondary)',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {s.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-gold">{s.category}</span>
                    </td>
                    <td>
                      {s.startingPrice ? (
                        <span style={{ fontWeight: 600, color: 'var(--color-champagne-gold)' }}>
                          ₹{s.startingPrice.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Custom Quote
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} color="var(--color-text-muted)" />
                        <span>{s.duration || '2-3 hrs'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`status-pill ${
                          s.isActive !== false ? 'status-approved' : 'status-rejected'
                        }`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle active / inactive"
                      >
                        {s.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          onClick={() => handleToggleActive(s)}
                          className="action-icon-btn"
                          title={s.isActive !== false ? 'Deactivate service' : 'Activate service'}
                        >
                          <Power size={14} color={s.isActive !== false ? '#2E7D32' : '#C62828'} />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="action-icon-btn"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id || s.id)}
                          className="action-icon-btn danger"
                          title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {isEditing ? 'Edit Makeup Service' : 'Add New Makeup Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span>Service Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Royal Bridal Makeup / Contemporary Reception Glam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3.5 - 4.0 Hours"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Starting Price (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 35000"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price Note</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Starting from ₹35,000 (Venue charges apply)"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                  />
                </div>
              </div>

              {/* Service Photograph */}
              <div className="form-group">
                <label className="form-label">
                  <span>Service Photograph</span>
                  <span className="required-star">*</span>
                </label>

                <div className="image-upload-dropzone">
                  <UploadCloud
                    size={28}
                    style={{ color: 'var(--color-champagne-gold)', margin: '0 auto 0.4rem auto' }}
                  />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    {uploading ? 'Uploading image...' : 'Upload service photograph'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <input
                  type="url"
                  className="form-input"
                  placeholder="Or enter direct image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />

                {formData.image && (
                  <div className="image-preview-frame">
                    <img src={formData.image} alt="Service Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Short Summary (Visible on Home & Cards)</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="A concise summary of what makes this makeup experience special..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Service Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Detailed breakdown of the artistry, techniques, products, and prep..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Inclusions (Enter each inclusion on a separate line)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Skin prep & hydration mask&#10;High Definition Complexion&#10;Intricate eye artistry & mink lashes&#10;Designer bridal hair styling&#10;Dupatta & jewelry placement"
                  value={formData.includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  style={{ minHeight: '110px' }}
                ></textarea>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="isActiveCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Service is Active and Available for Client Bookings
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  <Sparkles size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
