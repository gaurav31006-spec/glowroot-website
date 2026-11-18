import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Sparkles,
  Save,
  UploadCloud,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  User,
  Phone,
  Instagram,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getContent, updateContent, uploadImage } from '../../services/api';
import Toast from '../../components/Toast';

const AdminContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // home, about, testimonials, contact

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Testimonial modal state
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTestIdx, setEditingTestIdx] = useState(null);
  const [testFormData, setTestFormData] = useState({
    clientName: '',
    eventType: '',
    reviewText: '',
    rating: 5,
    avatar: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await getContent();
      if (res.data?.success) {
        setContent(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching content:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatsChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      stats: {
        ...(prev.stats || {}),
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await uploadImage(data);
      if (res.data?.success) {
        handleChange(field, res.data.url);
        setToastMessage('Image uploaded successfully!');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage('Upload failed.');
      setToastType('error');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await updateContent(content);
      if (res.data?.success) {
        setToastMessage('Website content updated and published live!');
        setToastType('success');
        setContent(res.data.data);
      }
    } catch (err) {
      setToastMessage('Failed to update website content.');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  // Testimonials management
  const openAddTestimonial = () => {
    setEditingTestIdx(null);
    setTestFormData({
      clientName: '',
      eventType: 'Bride, Royal Wedding',
      reviewText: '',
      rating: 5,
      avatar: '',
    });
    setTestModalOpen(true);
  };

  const openEditTestimonial = (item, idx) => {
    setEditingTestIdx(idx);
    setTestFormData({ ...item });
    setTestModalOpen(true);
  };

  const handleSaveTestimonial = () => {
    if (!testFormData.clientName.trim() || !testFormData.reviewText.trim()) {
      setToastMessage('Client name and review text are required.');
      setToastType('error');
      return;
    }

    const updatedList = [...(content.testimonials || [])];
    if (editingTestIdx !== null) {
      updatedList[editingTestIdx] = testFormData;
    } else {
      updatedList.push({ ...testFormData, id: 'test-' + Date.now() });
    }

    setContent((prev) => ({ ...prev, testimonials: updatedList }));
    setTestModalOpen(false);
    setToastMessage('Testimonial updated. Click "Save All Content" to make it live.');
    setToastType('success');
  };

  const handleDeleteTestimonial = (idx) => {
    if (!window.confirm('Remove this client testimonial?')) return;
    const updatedList = (content.testimonials || []).filter((_, i) => i !== idx);
    setContent((prev) => ({ ...prev, testimonials: updatedList }));
    setToastMessage('Testimonial removed. Click "Save All Content" to save changes.');
    setToastType('success');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-champagne-gold)' }}>
        <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
        <p>Loading website content...</p>
      </div>
    );
  }

  return (
    <div className="admin-content-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="admin-card-header" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="section-tagline">Dynamic Site Management</span>
          <h1 className="admin-card-title" style={{ fontSize: '2rem' }}>
            Website Content & Story
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Edit hero headings, About Ishita story & philosophy, client reviews, contact info, and availability.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          <Save size={18} />
          <span>{saving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Inner Content Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--color-gold-border)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`filter-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
        >
          Homepage Hero & Banner
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`filter-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
        >
          About Ishita Story & Philosophy
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`filter-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
        >
          Client Love & Testimonials ({content?.testimonials?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`filter-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
        >
          Contact, Studio & Instagram
        </button>
      </div>

      {/* Tab 1: Homepage Hero */}
      {activeTab === 'home' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
            Hero Section Editor
          </h3>

          <div className="form-group">
            <label className="form-label">Hero Main Heading</label>
            <input
              type="text"
              className="form-input"
              value={content?.heroHeading || ''}
              onChange={(e) => handleChange('heroHeading', e.target.value)}
              placeholder="Where Every Bride Finds Her Glow"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Subtitle</label>
            <textarea
              className="form-textarea"
              value={content?.heroSubtitle || ''}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              placeholder="Bespoke luxury bridal styling..."
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Hero Bridal Photograph</label>
            <div className="image-upload-dropzone">
              <UploadCloud size={24} style={{ color: 'var(--color-champagne-gold)', margin: '0 auto 4px auto' }} />
              <p style={{ fontSize: '0.85rem' }}>Upload high-resolution bridal hero photograph</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('heroImage', e)}
                style={{ fontSize: '0.8rem' }}
              />
            </div>
            <input
              type="url"
              className="form-input"
              value={content?.heroImage || ''}
              onChange={(e) => handleChange('heroImage', e.target.value)}
              placeholder="Or enter direct hero image URL"
            />
            {content?.heroImage && (
              <div className="image-preview-frame" style={{ maxHeight: '280px' }}>
                <img src={content.heroImage} alt="Hero Preview" />
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label">Seasonal Availability Notice Banner</label>
            <input
              type="text"
              className="form-input"
              value={content?.availabilityNotice || ''}
              onChange={(e) => handleChange('availabilityNotice', e.target.value)}
              placeholder="Now taking bridal bookings for 2026 – 2027 Wedding Season..."
            />
          </div>

          <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <Save size={16} />
            <span>Save Homepage Settings</span>
          </button>
        </div>
      )}

      {/* Tab 2: About Me & Philosophy */}
      {activeTab === 'about' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
            About Ishita — Profile & Philosophy
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">About Page Heading</label>
              <input
                type="text"
                className="form-input"
                value={content?.aboutHeading || ''}
                onChange={(e) => handleChange('aboutHeading', e.target.value)}
                placeholder="The Artist Behind Your Glow"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Artist Professional Tagline</label>
              <input
                type="text"
                className="form-input"
                value={content?.aboutTagline || ''}
                onChange={(e) => handleChange('aboutTagline', e.target.value)}
                placeholder="Celebrity & Luxury Bridal Makeup Artist"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Personal Introduction & Story</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '140px' }}
              value={content?.aboutStory || ''}
              onChange={(e) => handleChange('aboutStory', e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Makeup Philosophy (Skin-first, dewy, enduring)</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '110px' }}
              value={content?.aboutPhilosophy || ''}
              onChange={(e) => handleChange('aboutPhilosophy', e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Experience & Expertise</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '110px' }}
              value={content?.aboutExperience || ''}
              onChange={(e) => handleChange('aboutExperience', e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Why Clients Trust Her</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '110px' }}
              value={content?.aboutWhyTrust || ''}
              onChange={(e) => handleChange('aboutWhyTrust', e.target.value)}
            ></textarea>
          </div>

          {/* Photograph of Ishita */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Professional Photograph of Ishita</label>
            <div className="image-upload-dropzone">
              <UploadCloud size={24} style={{ color: 'var(--color-champagne-gold)', margin: '0 auto 4px auto' }} />
              <p style={{ fontSize: '0.85rem' }}>Upload portrait of Ishita</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('aboutImage', e)}
                style={{ fontSize: '0.8rem' }}
              />
            </div>
            <input
              type="url"
              className="form-input"
              value={content?.aboutImage || ''}
              onChange={(e) => handleChange('aboutImage', e.target.value)}
              placeholder="Or enter image URL"
            />
            {content?.aboutImage && (
              <div className="image-preview-frame" style={{ maxWidth: '300px' }}>
                <img src={content.aboutImage} alt="Ishita Preview" />
              </div>
            )}
          </div>

          <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <Save size={16} />
            <span>Save About Information</span>
          </button>
        </div>
      )}

      {/* Tab 3: Testimonials Management */}
      {activeTab === 'testimonials' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Client Reviews & Testimonials</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Showcase quotes and reviews from real brides.
              </p>
            </div>
            <button onClick={openAddTestimonial} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {(content?.testimonials || []).map((t, idx) => (
              <div
                key={t.id || idx}
                style={{
                  background: 'var(--color-ivory)',
                  border: '1px solid var(--color-gold-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', color: '#E6CA65', marginBottom: '0.5rem' }}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                    "{t.reviewText}"
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(197, 160, 89, 0.2)',
                  }}
                >
                  <div>
                    <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                      {t.clientName}
                    </h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-champagne-gold)' }}>
                      {t.eventType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => openEditTestimonial(t, idx)}
                      className="action-icon-btn"
                      title="Edit Testimonial"
                    >
                      <FileEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(idx)}
                      className="action-icon-btn danger"
                      title="Delete Testimonial"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Contact & Social Info */}
      {activeTab === 'contact' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
            Contact Details & Social Media Links
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={content?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 70167 74703"
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number (with country code)</label>
              <input
                type="text"
                className="form-input"
                value={content?.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+917016774703"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={content?.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="ishita@glowroot.in"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Handle</label>
              <input
                type="text"
                className="form-input"
                value={content?.instagramHandle || ''}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@glowrootbyishita"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instagram Profile URL</label>
            <input
              type="url"
              className="form-input"
              value={content?.instagramUrl || ''}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://www.instagram.com/glowrootbyishita"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Type & Destination Scope</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '80px' }}
              value={content?.businessAddress || ''}
              onChange={(e) => handleChange('businessAddress', e.target.value)}
              placeholder="On-Location Bridal Services (Pan-India & Destination Weddings)"
            ></textarea>
            <small style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              No physical storefront address required. Glowroot provides on-location luxury styling at client venues.
            </small>
          </div>

          <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <Save size={16} />
            <span>Save Contact Settings</span>
          </button>
        </div>
      )}

      {/* Testimonial Add / Edit Modal */}
      {testModalOpen && (
        <div className="modal-overlay" onClick={() => setTestModalOpen(false)}>
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTestIdx !== null ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h3>
              <button onClick={() => setTestModalOpen(false)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Bride / Client Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aarohi Singhania"
                value={testFormData.clientName}
                onChange={(e) => setTestFormData({ ...testFormData, clientName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Occasion / Venue *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Royal Wedding in Udaipur / Sunset Engagement"
                value={testFormData.eventType}
                onChange={(e) => setTestFormData({ ...testFormData, eventType: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Review / Testimonial Text *</label>
              <textarea
                className="form-textarea"
                placeholder="What did the client say about Ishita's makeup artistry, skin finish, and presence?"
                value={testFormData.reviewText}
                onChange={(e) => setTestFormData({ ...testFormData, reviewText: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Rating (Stars: 1 to 5)</label>
              <input
                type="number"
                min="1"
                max="5"
                className="form-input"
                value={testFormData.rating}
                onChange={(e) => setTestFormData({ ...testFormData, rating: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setTestModalOpen(false)} className="btn btn-secondary">
                <span>Cancel</span>
              </button>
              <button onClick={handleSaveTestimonial} className="btn btn-primary">
                <span>Save Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
