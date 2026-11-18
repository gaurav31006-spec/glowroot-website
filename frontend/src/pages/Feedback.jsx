import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, CheckCircle2, Sparkles, ArrowRight, MessageSquareQuote } from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import Toast from '../components/Toast';
import { submitFeedback, getContent } from '../services/api';
import '../styles/feedback.css';

const RATING_LABELS = {
  1: 'Could be improved',
  2: 'Fair experience',
  3: 'Good experience',
  4: 'Wonderful & Loved it!',
  5: 'Breathtaking & Pure Magic! ✨',
};

const Feedback = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    eventType: 'Bridal Makeup',
    reviewText: '',
    rating: 5,
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentReviews, setRecentReviews] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      const res = await getContent();
      if (res.data?.success && res.data.data.testimonials) {
        setRecentReviews(res.data.data.testimonials.slice(0, 3));
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingClick = (r) => {
    setFormData((prev) => ({ ...prev, rating: r }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName.trim()) {
      setToastMessage('Please enter your full name.');
      setToastType('error');
      return;
    }
    if (!formData.reviewText.trim()) {
      setToastMessage('Please share your review or feedback experience.');
      setToastType('error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitFeedback(formData);
      if (res.data?.success) {
        setSubmitted(true);
        setToastMessage('Thank you! Your review is now live on our home page.');
        setToastType('success');
        fetchRecentReviews();
      } else {
        setToastMessage(res.data?.message || 'Failed to submit review.');
        setToastType('error');
      }
    } catch (err) {
      setToastMessage('Could not submit review. Please try again.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Hero */}
      <section className="feedback-hero">
        <div className="container">
          <span className="section-tagline">Client Experience</span>
          <h1 className="section-title">Share Your Glow Story</h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Did Ishita doll you up for your wedding, engagement, or special celebration? We would
            love to hear about your experience! Your review will be featured directly on our home page.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="feedback-section container">
        <div className="feedback-grid">
          {/* Left Form / Success Card */}
          <div className="feedback-card">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
              >
                <div
                  style={{
                    width: '70px',
                    height: '70px',
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
                  <CheckCircle2 size={38} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  Thank You, {formData.clientName}!
                </h2>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.75',
                    marginBottom: '2rem',
                    fontSize: '1.02rem',
                  }}
                >
                  Your feedback has been saved and is now visible in the client love section on the
                  Glowroot home page. Ishita deeply appreciates your trust and kind words.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/" className="btn btn-primary">
                    <span>View on Home Page</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        clientName: '',
                        eventType: 'Bridal Makeup',
                        reviewText: '',
                        rating: 5,
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    <span>Submit Another Review</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Leave Your Review
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    Share your experience with future brides looking for their dream bridal artist.
                  </p>
                </div>

                {/* Rating Stars Selector */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Your Overall Rating *</span>
                  </label>
                  <div className="star-rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`star-btn ${
                          (hoverRating || formData.rating) >= star ? 'active' : ''
                        }`}
                        aria-label={`${star} Stars`}
                      >
                        <Star size={32} fill={(hoverRating || formData.rating) >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                    <span className="star-rating-label">
                      {RATING_LABELS[hoverRating || formData.rating]}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="clientName">
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    className="form-input"
                    placeholder="e.g. Radhika Kapoor / Tanya Singhania"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Event Type */}
                <div className="form-group">
                  <label className="form-label" htmlFor="eventType">
                    <span>Event or Celebration Occasion *</span>
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    className="form-select"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="Bridal Makeup">Bridal Makeup (Wedding Day)</option>
                    <option value="Engagement Makeup">Engagement / Ring Ceremony</option>
                    <option value="Reception Makeup">Grand Reception Glam</option>
                    <option value="Cocktail / Sangeet">Cocktail / Sangeet Night</option>
                    <option value="Party Makeup">Party Makeup / Sister of the Bride</option>
                    <option value="Destination Wedding">Destination Wedding Celebration</option>
                  </select>
                </div>

                {/* Review Message */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reviewText">
                    <span>Your Review & Experience *</span>
                  </label>
                  <textarea
                    id="reviewText"
                    name="reviewText"
                    className="form-textarea"
                    placeholder="Tell us about the makeup look, how it held up through the ceremony, the compliments you received, or Ishita's calm presence on your big day..."
                    value={formData.reviewText}
                    onChange={handleChange}
                    style={{ minHeight: '140px' }}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem' }}
                  disabled={submitting}
                >
                  <Sparkles size={17} />
                  <span>{submitting ? 'Submitting Your Review...' : 'Post Review on Home Page'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Why Your Review Matters + Recent Reviews Preview */}
          <div>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-gold-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  color: 'var(--color-champagne-gold)',
                  marginBottom: '0.85rem',
                }}
              >
                <Heart size={22} fill="currentColor" />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                  Why Your Words Matter
                </h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.75' }}>
                Bridal beauty is deeply personal. For an engaged bride researching artists, reading
                authentic feedback from brides who walked down the aisle makes all the difference.
                Thank you for taking a moment to share your love!
              </p>
            </div>

            {/* Recent Reviews Preview */}
            <div
              style={{
                background: 'var(--color-ivory)',
                border: '1px solid var(--color-gold-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                Recent Bride Reviews
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentReviews.map((rev, idx) => (
                  <div
                    key={rev.id || idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(197, 160, 89, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '2px', color: '#E6CA65', marginBottom: '0.35rem' }}>
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '0.65rem' }}>
                      "{rev.reviewText}"
                    </p>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {rev.clientName}{' '}
                      <span style={{ fontWeight: 400, color: 'var(--color-champagne-gold)', marginLeft: '4px' }}>
                        • {rev.eventType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
