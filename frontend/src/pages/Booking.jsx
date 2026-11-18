import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import Toast from '../components/Toast';
import { submitBooking, getServices, getContent } from '../services/api';
import '../styles/booking.css';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [servicesList, setServicesList] = useState([]);
  const [content, setContent] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    service: preselectedService || 'Bridal Makeup',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      const [srvRes, cntRes] = await Promise.all([getServices(true), getContent()]);
      if (srvRes.data?.success) setServicesList(srvRes.data.data);
      if (cntRes.data?.success) setContent(cntRes.data.data);
    } catch (e) {
      console.error('Error fetching services/content in booking:', e);
    }
  };

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else {
      const digitsOnly = formData.mobileNumber.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10) {
        newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a makeup service.';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Please choose your event date.';
    }

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = 'Please provide the event location / city / venue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToastMessage('Please resolve the errors highlighted in the form.');
      setToastType('error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitBooking(formData);
      if (res.data?.success) {
        setIsSuccess(true);
        setToastMessage('Booking enquiry received! Ishita will reach out shortly.');
        setToastType('success');
      } else {
        setToastMessage(res.data?.message || 'Failed to submit enquiry.');
        setToastType('error');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setToastMessage(
        err.response?.data?.message || 'Could not connect to server. Please try WhatsApp directly.'
      );
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today) in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const whatsappUrl = `https://wa.me/${(content?.whatsapp || '917016774703').replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(
    `Hi Ishita, I would like to check availability for ${formData.service || 'Bridal Makeup'} on ${
      formData.eventDate || 'my upcoming wedding date'
    } in ${formData.eventLocation || 'New Delhi'}. Name: ${formData.fullName || ''}`
  )}`;

  return (
    <div className="booking-page">
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}

      {/* Hero */}
      <section className="booking-hero">
        <div className="container">
          <span className="section-tagline">Secure Your Date</span>
          <h1 className="section-title">Bridal Appointment Enquiry</h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Begin your wedding glow journey. Due to Ishita's personalized one-bride-a-day focus,
            wedding dates are reserved on a first-confirmed basis.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="booking-section container">
        <div className="booking-grid">
          {/* Form / Success Box */}
          <div className="booking-form-card">
            {isSuccess ? (
              <motion.div
                className="booking-success-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="booking-success-icon">
                  <CheckCircle2 size={40} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  Enquiry Successfully Received!
                </h2>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    lineHeight: '1.75',
                    marginBottom: '2rem',
                  }}
                >
                  Thank you, <strong>{formData.fullName}</strong>. Your enquiry for{' '}
                  <span style={{ color: 'var(--color-champagne-gold)', fontWeight: 600 }}>
                    {formData.service}
                  </span>{' '}
                  on <strong>{formData.eventDate}</strong> has been saved. Ishita will personally
                  review your date's calendar and connect with you shortly via WhatsApp or call.
                </p>

                <div
                  style={{
                    background: 'var(--color-ivory)',
                    border: '1px solid var(--color-gold-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'left',
                    marginBottom: '2rem',
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.65rem', color: 'var(--color-text-primary)' }}>
                    Summary of Enquiry:
                  </h4>
                  <p style={{ fontSize: '0.88rem', margin: '4px 0' }}>
                    <strong>Client:</strong> {formData.fullName} ({formData.mobileNumber})
                  </p>
                  <p style={{ fontSize: '0.88rem', margin: '4px 0' }}>
                    <strong>Service:</strong> {formData.service}
                  </p>
                  <p style={{ fontSize: '0.88rem', margin: '4px 0' }}>
                    <strong>Date & Venue:</strong> {formData.eventDate} at {formData.eventLocation}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <MessageCircle size={18} />
                    <span>Connect on WhatsApp Now</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        fullName: '',
                        mobileNumber: '',
                        email: '',
                        service: 'Bridal Makeup',
                        eventDate: '',
                        eventTime: '',
                        eventLocation: '',
                        message: '',
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="booking-form-header">
                  <h2 className="booking-form-title">Tell Us About Your Special Day</h2>
                  <p className="booking-form-subtitle">
                    Please provide your details below. All fields marked with * are required.
                  </p>
                </div>

                {/* Row 1: Name & Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">
                      <span>Full Name</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input"
                      placeholder="e.g. Ananya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="mobileNumber">
                      <span>Mobile Number (WhatsApp Preferred)</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                    />
                    {errors.mobileNumber && (
                      <span className="form-error">{errors.mobileNumber}</span>
                    )}
                  </div>
                </div>

                {/* Row 2: Email & Service */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      <span>Email Address</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">
                      <span>Select Makeup Service</span>
                      <span className="required-star">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="form-select"
                      value={formData.service}
                      onChange={handleChange}
                    >
                      {servicesList.length > 0 ? (
                        servicesList.map((srv) => (
                          <option key={srv._id || srv.id} value={srv.name}>
                            {srv.name} {srv.startingPrice ? `(₹${srv.startingPrice.toLocaleString('en-IN')})` : ''}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Bridal Makeup">Bridal Makeup</option>
                          <option value="Engagement Makeup">Engagement Makeup</option>
                          <option value="Reception Makeup">Reception Makeup</option>
                          <option value="Cocktail Makeup">Cocktail Makeup</option>
                          <option value="Party Makeup">Party Makeup</option>
                          <option value="Destination Bridal Package">Destination Bridal Package</option>
                        </>
                      )}
                    </select>
                    {errors.service && <span className="form-error">{errors.service}</span>}
                  </div>
                </div>

                {/* Row 3: Event Date & Time */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="eventDate">
                      <span>Event Date</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      min={todayStr}
                      className="form-input"
                      value={formData.eventDate}
                      onChange={handleChange}
                    />
                    {errors.eventDate && <span className="form-error">{errors.eventDate}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="eventTime">
                      <span>Event Time / Prep Ready Time</span>
                    </label>
                    <input
                      type="text"
                      id="eventTime"
                      name="eventTime"
                      className="form-input"
                      placeholder="e.g. Ready by 4:30 PM for Pheras"
                      value={formData.eventTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Row 4: Event Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="eventLocation">
                    <span>Event Location / City / Hotel Venue</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventLocation"
                    name="eventLocation"
                    className="form-input"
                    placeholder="e.g. ITC Maurya, Diplomatic Enclave, New Delhi / Jagmandir Island, Udaipur"
                    value={formData.eventLocation}
                    onChange={handleChange}
                  />
                  {errors.eventLocation && (
                    <span className="form-error">{errors.eventLocation}</span>
                  )}
                </div>

                {/* Row 5: Additional Message */}
                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    <span>Additional Message / Skin Concerns / Outfit Details</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Tell us about your outfit palette, lehenga weight, number of family members requiring makeup, or any skin preferences..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Crucial Approval Notice */}
                <div className="booking-approval-note">
                  <ShieldAlert size={22} />
                  <div>
                    <strong>Important Confirmation Policy:</strong>
                    <br />
                    Submitting this form registers your enquiry with Glowroot. Your booking is
                    formally confirmed only after Ishita checks calendar availability and approves
                    your appointment request.
                  </div>
                </div>

                {/* Submit & WhatsApp Buttons */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ flex: 1, minWidth: '220px', padding: '0.95rem 2rem' }}
                  >
                    <Sparkles size={18} />
                    <span>{submitting ? 'Submitting Enquiry...' : 'Submit Booking Enquiry'}</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Enquiry Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Guidelines */}
          <div>
            <div className="booking-sidebar-card">
              <h3 className="sidebar-card-title">How Booking Works</h3>

              <div className="sidebar-step-item">
                <div className="sidebar-step-num">1</div>
                <div className="sidebar-step-text">
                  <h5>Submit Enquiry</h5>
                  <p>Share your wedding date, venue details, and preferred makeup service.</p>
                </div>
              </div>

              <div className="sidebar-step-item">
                <div className="sidebar-step-num">2</div>
                <div className="sidebar-step-text">
                  <h5>Availability Check</h5>
                  <p>Ishita verifies her schedule to ensure exclusive 1:1 attention for your date.</p>
                </div>
              </div>

              <div className="sidebar-step-item">
                <div className="sidebar-step-num">3</div>
                <div className="sidebar-step-text">
                  <h5>Look Consultation</h5>
                  <p>We discuss outfit palettes, jewelry aesthetics, hair styling, and skin prep.</p>
                </div>
              </div>

              <div className="sidebar-step-item">
                <div className="sidebar-step-num">4</div>
                <div className="sidebar-step-text">
                  <h5>Confirmed & Secured</h5>
                  <p>Your wedding slot is blocked on the calendar with a formal confirmation token.</p>
                </div>
              </div>
            </div>

            <div
              className="booking-sidebar-card"
              style={{
                background: 'var(--color-cream)',
                border: '1px solid var(--color-gold-border)',
              }}
            >
              <h3 className="sidebar-card-title">Direct Studio Contact</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                For urgent enquiries or destination wedding inquiries, feel free to call or WhatsApp
                the studio team directly:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <a
                  href={`tel:${content?.phone || '+917016774703'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)' }}
                >
                  <Phone size={16} color="var(--color-champagne-gold)" />
                  <span>{content?.phone || '+91 70167 74703'}</span>
                </a>
                <a
                  href={`https://wa.me/${(content?.whatsapp || '917016774703').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)' }}
                >
                  <MessageCircle size={16} color="var(--color-champagne-gold)" />
                  <span>WhatsApp: +91 70167 74703</span>
                </a>
                <a
                  href={`mailto:${content?.email || 'ishita@glowroot.in'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)' }}
                >
                  <Mail size={16} color="var(--color-champagne-gold)" />
                  <span>{content?.email || 'ishita@glowroot.in'}</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  <Sparkles size={15} color="var(--color-champagne-gold)" />
                  <span>On-location bridal services pan-India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
