import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Heart,
  Gem,
  Award,
  Clock,
  Instagram,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import Lightbox from '../components/Lightbox';
import { getContent, getServices, getPortfolio } from '../services/api';
import '../styles/home.css';

const Home = () => {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state for portfolio preview
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reviews toggle state (show top 3 by default)
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [contentRes, servicesRes, portfolioRes] = await Promise.all([
        getContent(),
        getServices(true),
        getPortfolio('All'),
      ]);

      if (contentRes.data?.success) setContent(contentRes.data.data);
      if (servicesRes.data?.success) setServices(servicesRes.data.data.slice(0, 3));
      if (portfolioRes.data?.success) setPortfolio(portfolioRes.data.data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-ornament"></div>
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Bespoke Luxury Bridal Artistry</span>
              </div>

              <h1 className="hero-title">
                Where Every Bride Finds Her{' '}
                <span className="hero-title-italic">Glow.</span>
              </h1>

              <p className="hero-subtitle">
                {content?.heroSubtitle ||
                  'Bespoke bridal styling & luxury makeup artistry designed to illuminate your authentic beauty on your most unforgettable day.'}
              </p>

              <div className="hero-buttons">
                <Link to="/booking" className="btn btn-primary">
                  <span>Book Your Appointment</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/portfolio" className="btn btn-secondary">
                  <span>Explore My Work</span>
                </Link>
              </div>

              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <span className="hero-trust-num">450+</span>
                  <span className="hero-trust-label">Brides Styled</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">6+</span>
                  <span className="hero-trust-label">Years Artistry</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">100%</span>
                  <span className="hero-trust-label">Luxury Vanity</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">35+</span>
                  <span className="hero-trust-label">Destinations</span>
                </div>
              </div>
            </motion.div>

            {/* Right Bridal Photography */}
            <motion.div
              className="hero-image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="hero-gold-ring"></div>
              <div className="hero-image-frame">
                <img
                  src={
                    content?.heroImage ||
                    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt="Glowroot by Ishita Luxury Bride"
                />
              </div>

              <motion.div
                className="hero-floating-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="hero-floating-icon">
                  <Gem size={22} />
                </div>
                <div className="hero-floating-text">
                  <h4>Ishita Artistry</h4>
                  <p>Skin-First • Luminous • Timeless</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Featured Services Section */}
      <section className="home-services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Signature Experiences</span>
            <h2 className="section-title">Curated Bridal & Event Artistry</h2>
            <FloralDivider />
            <p className="section-description">
              Each bridal package is tailored to harmonize with your personal aesthetic, wedding
              ensemble, jewelry, and destination lighting.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service._id || service.id}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="service-card-img-wrap">
                  <img src={service.image} alt={service.name} />
                  <span className="service-card-category">{service.category}</span>
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.shortDescription}</p>
                  <div className="service-card-footer">
                    <div className="service-card-price">
                      {service.startingPrice ? (
                        <>
                          <span className="service-price-label">Starting From</span>
                          <span className="service-price-val">
                            ₹{service.startingPrice.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span className="service-price-label">Custom Consultation</span>
                      )}
                    </div>
                    <Link
                      to={`/booking?service=${encodeURIComponent(service.name)}`}
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      <span>Book Service</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-secondary">
              <span>View All 5 Makeup Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Glowroot */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">The Glowroot Standard</span>
            <h2 className="section-title">Why Brides Trust Ishita</h2>
            <FloralDivider />
            <p className="section-description">
              Your wedding morning should be peaceful, pampered, and stress-free. Here is what sets
              our bridal experience apart.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon-wrap">
                <Gem size={28} />
              </div>
              <h3 className="why-card-title">100% Luxury Vanity</h3>
              <p className="why-card-text">
                Exclusively stocked with Dior, Charlotte Tilbury, Tom Ford, NARS, Chanel, and Pat
                McGrath for unmatched longevity and glass-skin radiance.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap">
                <Heart size={28} />
              </div>
              <h3 className="why-card-title">Skin-First Philosophy</h3>
              <p className="why-card-text">
                No heavy mask-like foundation. We celebrate your authentic skin texture with
                featherweight layers that look stunning in 4K video and in-person candlelight.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap">
                <Award size={28} />
              </div>
              <h3 className="why-card-title">One-Bride-A-Day Focus</h3>
              <p className="why-card-text">
                Ishita reserves entire wedding dates exclusively for you. No rushed schedules, no
                assistants substituting—complete, dedicated personal attention.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap">
                <Clock size={28} />
              </div>
              <h3 className="why-card-title">Destination Ready</h3>
              <p className="why-card-text">
                Extensive experience handling humidity in Goa, desert climate in Rajasthan, or royal
                palace settings across India with sweatproof, camera-ready staying power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Portfolio Highlights Preview */}
      <section style={{ padding: '6.5rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Real Brides & Artistry</span>
            <h2 className="section-title">Recent Bridal Transformations</h2>
            <FloralDivider />
            <p className="section-description">
              A glimpse into our recent bridal, cocktail, and engagement styling. Click any image
              to view in full screen.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {portfolio.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                className="luxury-card"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => openLightbox(index)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      color: '#FFFFFF',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--color-gold-light)',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {item.category}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/portfolio" className="btn btn-primary">
              <span>Explore Complete Portfolio</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Love Notes</span>
            <h2 className="section-title">Words From Our Brides</h2>
            <FloralDivider />
            <p className="section-description">
              Cherished memories from real brides who entrusted their most important moments to
              Glowroot by Ishita.
            </p>
          </div>

          <div className="testimonials-grid">
            {(showAllReviews
              ? content?.testimonials || []
              : (content?.testimonials || []).slice(0, 3)
            ).map((t, i) => (
              <motion.div
                key={t.id || i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="testimonial-stars">
                  {[...Array(t.rating || 5)].map((_, starIdx) => (
                    <Star key={starIdx} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.reviewText}"</p>
                <div className="testimonial-author">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.clientName} className="testimonial-avatar" />
                  ) : (
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'var(--color-dusty-rose-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-dusty-rose)',
                        fontWeight: 600,
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {t.clientName?.charAt(0) || 'B'}
                    </div>
                  )}
                  <div>
                    <h4 className="testimonial-author-name">{t.clientName}</h4>
                    <span className="testimonial-event-type">{t.eventType}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toggle View All Reviews Button */}
          {(content?.testimonials || []).length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '2.25rem' }}>
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="btn btn-outline"
                style={{
                  padding: '0.75rem 2.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  cursor: 'pointer',
                }}
              >
                <span>
                  {showAllReviews
                    ? 'Show Less'
                    : `View All Reviews (${(content?.testimonials || []).length})`}
                </span>
                {showAllReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}

          {/* Feedback & Review Callout */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/feedback" className="btn btn-secondary" style={{ padding: '0.85rem 2rem' }}>
              <Star size={16} fill="currentColor" color="var(--color-champagne-gold)" />
              <span>Were You A Glowroot Bride? Leave Your Review</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Instagram Gallery Preview */}
      <section className="insta-section">
        <div className="container">
          <span className="section-tagline">Behind The Scenes</span>
          <h2 className="section-title">Follow On Instagram</h2>
          <FloralDivider />
          <p className="section-description">
            Daily bridal beauty inspiration, real wedding mornings, and makeup vanity peeks on{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              {content?.instagramHandle || '@glowrootbyishita'}
            </strong>.
          </p>

          <div className="insta-grid">
            {(content?.instagramPosts || []).map((post, i) => (
              <a
                key={post.id || i}
                href={content?.instagramUrl || 'https://www.instagram.com/glowrootbyishita'}
                target="_blank"
                rel="noopener noreferrer"
                className="insta-item"
              >
                <img src={post.image} alt={post.caption || 'Instagram Post'} />
                <div className="insta-overlay">
                  <Instagram size={28} />
                  <span style={{ fontSize: '0.85rem', marginTop: '0.4rem', fontWeight: 500 }}>
                    {post.likes} Likes
                  </span>
                  <p className="insta-caption">{post.caption}</p>
                </div>
              </a>
            ))}
          </div>

          <a
            href={content?.instagramUrl || 'https://www.instagram.com/glowrootbyishita'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Instagram size={17} />
            <span>Follow {content?.instagramHandle || '@glowrootbyishita'}</span>
          </a>
        </div>
      </section>

      {/* 7. Bottom Booking CTA Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2C2623 0%, #1A1615 100%)',
          color: '#FFFFFF',
          padding: '5rem 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif-accent)',
              fontSize: '1.1rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-champagne-gold)',
              display: 'block',
              marginBottom: '0.85rem',
            }}
          >
            2026 – 2027 Wedding Calendar
          </span>
          <h2
            style={{
              fontSize: '2.6rem',
              fontFamily: 'var(--font-heading)',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
            }}
          >
            Let Us Create Your Signature Bridal Glow
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#D8CFC4',
              lineHeight: '1.8',
              marginBottom: '2.25rem',
            }}
          >
            Wedding dates fill months in advance. Secure your consultation today and ensure Ishita's
            presence on your most cherished wedding celebrations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem' }}>
              <span>Enquire For Your Date</span>
              <ArrowRight size={17} />
            </Link>
            <a
              href={`https://wa.me/${(content?.whatsapp || '917016774703').replace(/[^0-9]/g, '')}?text=Hi%20Ishita,%20I%20would%20like%20to%20check%20availability%20for%20my%20wedding%20date.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderColor: 'rgba(197, 160, 89, 0.4)',
              }}
            >
              <span>Instant WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox for Portfolio preview */}
      <Lightbox
        items={portfolio}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % portfolio.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + portfolio.length) % portfolio.length)}
      />
    </div>
  );
};

export default Home;
