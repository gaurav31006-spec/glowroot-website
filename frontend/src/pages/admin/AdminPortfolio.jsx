import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Eye,
  UploadCloud,
  Check,
  X,
  Sparkles,
  ArrowUpDown,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  reorderPortfolio,
  uploadImage,
} from '../../services/api';
import Toast from '../../components/Toast';

const CATEGORIES = ['Bridal', 'Engagement', 'Reception', 'Cocktail', 'Party'];

const AdminPortfolio = () => {
  const { refreshStats } = useOutletContext();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Bridal',
    image: '',
    caption: '',
    description: '',
    clientName: '',
    isFeatured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchPortfolioList();
  }, []);

  const fetchPortfolioList = async () => {
    try {
      setLoading(true);
      const res = await getPortfolio('All');
      if (res.data?.success) {
        setPortfolio(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching portfolio:', e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      category: 'Bridal',
      image: '',
      caption: '',
      description: '',
      clientName: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item._id || item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'Bridal',
      image: item.image || '',
      caption: item.caption || '',
      description: item.description || '',
      clientName: item.clientName || '',
      isFeatured: item.isFeatured || false,
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
        setToastMessage('Photograph uploaded successfully!');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to upload photograph.');
      setToastType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setToastMessage('Please enter a photograph title.');
      setToastType('error');
      return;
    }
    if (!formData.image.trim()) {
      setToastMessage('Please upload an image file or provide an image URL.');
      setToastType('error');
      return;
    }

    try {
      if (isEditing) {
        const res = await updatePortfolio(currentId, formData);
        if (res.data?.success) {
          setToastMessage('Portfolio photograph updated!');
          setToastType('success');
        }
      } else {
        const res = await createPortfolio(formData);
        if (res.data?.success) {
          setToastMessage('New photograph added to portfolio!');
          setToastType('success');
        }
      }
      setModalOpen(false);
      fetchPortfolioList();
      if (refreshStats) refreshStats();
    } catch (err) {
      setToastMessage('Error saving portfolio photograph.');
      setToastType('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photograph from the portfolio gallery?')) return;
    try {
      const res = await deletePortfolio(id);
      if (res.data?.success) {
        setToastMessage('Photograph removed.');
        setToastType('success');
        fetchPortfolioList();
        if (refreshStats) refreshStats();
      }
    } catch (e) {
      setToastMessage('Failed to delete photograph.');
      setToastType('error');
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...portfolio];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    setPortfolio(newItems);

    const orderedIds = newItems.map((item) => item._id || item.id);
    try {
      await reorderPortfolio(orderedIds);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  return (
    <div className="admin-portfolio-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="admin-card-header" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="section-tagline">Visual Gallery</span>
          <h1 className="admin-card-title" style={{ fontSize: '2rem' }}>
            Portfolio Management
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Upload, arrange, caption, and showcase your actual makeup photography.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Upload New Photograph</span>
        </button>
      </div>

      {/* Grid of Portfolio Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-champagne-gold)' }}>
          <Sparkles size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto' }} />
          <p>Loading portfolio photographs...</p>
        </div>
      ) : portfolio.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ImageIcon size={48} style={{ color: 'var(--color-champagne-gold)', marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            No Photographs Uploaded Yet
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Click "Upload New Photograph" to add bridal transformations to your website gallery.
          </p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Upload First Photograph</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {portfolio.map((item, index) => (
            <div
              key={item._id || item.id}
              className="luxury-card"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    background: 'rgba(253, 251, 247, 0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--color-champagne-gold)',
                    border: '1px solid var(--color-gold-border)',
                  }}
                >
                  {item.category}
                </span>

                {item.isFeatured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {item.title}
                </h4>

                {item.clientName && (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-dusty-rose)',
                      marginBottom: '0.4rem',
                      display: 'block',
                    }}
                  >
                    Client: {item.clientName}
                  </span>
                )}

                {item.caption && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                      flex: 1,
                    }}
                  >
                    {item.caption}
                  </p>
                )}

                {/* Bottom Action Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(197, 160, 89, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="action-icon-btn"
                      title="Move Earlier in Gallery"
                    >
                      <MoveUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === portfolio.length - 1}
                      className="action-icon-btn"
                      title="Move Later in Gallery"
                    >
                      <MoveDown size={13} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => {
                        setPreviewItem(item);
                        setPreviewModalOpen(true);
                      }}
                      className="action-icon-btn"
                      title="Preview details"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="action-icon-btn"
                      title="Edit photo details"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="action-icon-btn danger"
                      title="Delete photograph"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Photograph Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {isEditing ? 'Edit Portfolio Photograph' : 'Upload New Portfolio Work'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span>Photograph Title</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Royal Vermillion Bride / Sunset Pastel Sangeet"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <label className="form-label">Bride / Client Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ananya S."
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="form-group">
                <label className="form-label">
                  <span>Upload Image File or Provide URL</span>
                  <span className="required-star">*</span>
                </label>

                <div className="image-upload-dropzone">
                  <UploadCloud
                    size={32}
                    style={{ color: 'var(--color-champagne-gold)', margin: '0 auto 0.5rem auto' }}
                  />
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    {uploading ? 'Uploading photograph...' : 'Select bridal photograph from your device'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <input
                  type="url"
                  className="form-input"
                  placeholder="Or paste direct image URL (https://...)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />

                {formData.image && (
                  <div className="image-preview-frame">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Short Caption</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Soft bronze eyes paired with heirloom Kundan adornments."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Details about lehenga palette, skin prep, airbrush finish, and ceremony lighting..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="isFeaturedCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="isFeaturedCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Feature on Homepage Portfolio Highlight
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
                  <span>{isEditing ? 'Save Changes' : 'Publish Photograph'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && previewItem && (
        <div className="modal-overlay" onClick={() => setPreviewModalOpen(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Photograph Preview</h3>
              <button onClick={() => setPreviewModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <img
              src={previewItem.image}
              alt={previewItem.title}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '1rem' }}>
              <span className="badge-gold">{previewItem.category}</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginTop: '0.5rem' }}>
                {previewItem.title}
              </h3>
              {previewItem.caption && (
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  {previewItem.caption}
                </p>
              )}
              {previewItem.description && (
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                  {previewItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
