import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Plane,
  Heart,
  Star,
} from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import Toast from '../components/Toast';
import { getContent } from '../services/api';
import '../styles/contact.css';

const Contact = () => {
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await getContent();
      if (res.data?.success) setContent(res.data.data);
    } catch (e) {
      console.error('Error fetching contact content:', e);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setToastMessage('Please fill in your name, email address, and message.');
      setToastType('error');
      return;
    }

    setSent(true);
    setToastMessage('Thank you! Your message has been sent to Ishita. We will respond within 24 hours.');
    setToastType('success');
  };

  const rawPhone = (content?.phone || '7016774703').replace(/[^0-9]/g, '');
  const rawWhatsapp = (content?.whatsapp || '7016774703').replace(/[^0-9]/g, '');
  const displayPhone = content?.phone || '+91 70167 74703';
  const instagramHandle = content?.instagramHandle || '@glowrootbyishita';
  const instagramUrl = content?.instagramUrl || 'https://www.instagram.com/glowrootbyishita';

  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    'Hi Ishita, I would like to get in touch regarding Glowroot bridal makeup services.'
  )}`;

  return (
    <div className="contact-page">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-tagline">Get In Touch</span>
          <h1 className="section-title">Connect With Glowroot</h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
            We would be delighted to hear from you. Reach out via WhatsApp, phone call, email, or
            Instagram for booking inquiries, destination quotes, or client reviews.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="contact-section container">
        <div className="contact-grid">
          {/* Left Column: Direct Contact Details */}
          <div className="contact-info-cards">
            {/* WhatsApp */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <MessageCircle size={24} />
              </div>
              <div className="contact-card-text">
                <h4>WhatsApp Direct</h4>
                <p>Chat directly with Ishita on WhatsApp for instant availability queries & bridal consultations.</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <span>Chat on WhatsApp: +91 {rawWhatsapp.slice(-10)}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <Phone size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Phone Call</h4>
                <p>Call directly for bookings, trials, and consultation details.</p>
                <a href={`tel:${displayPhone}`}>
                  <span>{displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <Mail size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Email Inquiries</h4>
                <p>For bridal packages, editorial styling, and destination queries.</p>
                <a href={`mailto:${content?.email || 'ishita@glowroot.in'}`}>
                  <span>{content?.email || 'ishita@glowroot.in'}</span>
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <Instagram size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Official Instagram</h4>
                <p>Follow our daily reels, real bride stories, and behind-the-scenes transformations.</p>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  <span>{instagramHandle}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* On-Location Destination Note */}
            <div
              className="contact-card-item"
              style={{
                background: 'linear-gradient(135deg, var(--color-dusty-rose-soft) 0%, var(--color-ivory) 100%)',
                borderColor: 'var(--color-dusty-rose-light)',
              }}
            >
              <div className="contact-icon-box" style={{ background: '#FFFFFF', color: 'var(--color-dusty-rose)' }}>
                <Plane size={24} />
              </div>
              <div className="contact-card-text">
                <h4>On-Location Bridal Services</h4>
                <p style={{ color: 'var(--color-text-primary)' }}>
                  Ishita travels directly to your wedding venue, luxury hotel, or destination
                  worldwide. Exclusive 1:1 on-site bridal vanity setup provided.
                </p>
              </div>
            </div>

            {/* Share Feedback Quick Banner */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-gold-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', color: '#E6CA65', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                Were You A Glowroot Bride?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                We would love your review! Share your feedback to be featured on our home page.
              </p>
              <Link to="/feedback" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                <span>Leave A Review</span>
                <Heart size={14} style={{ color: 'var(--color-dusty-rose)' }} />
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="contact-form-card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--color-gold-subtle)',
                    color: 'var(--color-champagne-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    border: '2px solid var(--color-champagne-gold)',
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Thank you for writing to Glowroot. Ishita will personally read your note and get back
                  to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                  }}
                  className="btn btn-primary"
                >
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  Send A Message
                </h3>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '2rem',
                  }}
                >
                  Have a question or custom bridal request? Leave a message below.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactName">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Radhika Mehra"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactPhone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. 7016774703"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactEmail">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="email"
                      className="form-input"
                      placeholder="radhika@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactSubject">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="contactSubject"
                    name="subject"
                    className="form-input"
                    placeholder="e.g. Destination Wedding in Udaipur / Pre-Bridal Consultation"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactMsg">
                    Your Message *
                  </label>
                  <textarea
                    id="contactMsg"
                    name="message"
                    className="form-textarea"
                    placeholder="How can Ishita assist you?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
