import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import { getContent } from '../services/api';
import '../styles/about.css';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const res = await getContent();
      if (res.data?.success) {
        setContent(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="about-hero">
        <div className="container">
          <span className="section-tagline">Meet The Artist</span>
          <h1 className="section-title">
            {content?.aboutHeading || 'The Artist Behind Your Glow'}
          </h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Get to know Ishita—celebrated bridal artist, skin-first advocate, and the creative soul
            crafting unforgettable bridal looks.
          </p>
        </div>
      </section>

      {/* Main Story & Photograph */}
      <section className="about-main-section">
        <div className="container">
          <div className="about-grid">
            {/* Left Photo of Ishita */}
            <motion.div
              className="about-img-wrapper"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ position: 'relative' }}
            >
              <div className="about-img-accent-ring"></div>
              <div className="about-img-frame">
                <img
                  src={
                    content?.aboutImage ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop'
                  }
                  alt="Ishita — Founder & Luxury Makeup Artist at Glowroot"
                />
              </div>

              {/* Decorative signature badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  right: '10px',
                  background: 'rgba(253, 251, 247, 0.96)',
                  border: '1px solid var(--color-gold-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.4rem',
                  boxShadow: 'var(--shadow-hover)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '1.9rem',
                    color: 'var(--color-champagne-gold)',
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  Ishita
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Master Bridal Artist
                </span>
              </div>
            </motion.div>

            {/* Right Story & Philosophy */}
            <motion.div
              className="about-story-text"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="about-tagline-sub">
                {content?.aboutTagline || 'Celebrity & Luxury Bridal Makeup Artist'}
              </div>
              <h2 className="about-story-title">
                Honoring Your Authenticity, Elevating Your Glow
              </h2>

              <p className="about-story-paragraph">
                {content?.aboutStory ||
                  'Welcome to Glowroot. Founded with an unwavering passion for high-fashion elegance and bridal perfection, Glowroot by Ishita is dedicated to transforming each bride into the most radiant, authentic version of herself. We believe bridal makeup is not a mask—it is an intimate celebration of your individuality, bone structure, and innate allure.'}
              </p>

              <div
                style={{
                  background: 'var(--color-dusty-rose-soft)',
                  borderLeft: '3px solid var(--color-dusty-rose)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  margin: '1.75rem 0',
                }}
              >
                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  "Makeup is a reflection of joy, not a disguise."
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  — Ishita, Founder of Glowroot
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <Link to="/booking" className="btn btn-primary">
                  <span>Book Consultation With Ishita</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/services" className="btn btn-secondary">
                  <span>Explore Bridal Services</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Pillars: Philosophy, Experience, Why Clients Trust */}
          <div className="about-pillars-grid">
            <motion.div
              className="pillar-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="pillar-card-icon">
                <Heart size={26} />
              </div>
              <h3 className="pillar-title">Makeup Philosophy</h3>
              <p className="pillar-desc">
                {content?.aboutPhilosophy ||
                  'Skin-first, dewy, and enduring. Ishita avoids thick cakiness, opting instead for luminous, featherlight textures that look ethereal in candlelight, daylight, and crisp 4K cinematography. Every look is custom-tailored to balance your lehenga, heirloom jewels, and skin undertones.'}
              </p>
            </motion.div>

            <motion.div
              className="pillar-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="pillar-card-icon">
                <Award size={26} />
              </div>
              <h3 className="pillar-title">Experience & Expertise</h3>
              <p className="pillar-desc">
                {content?.aboutExperience ||
                  'Over 6+ years of bridal artistry, 450+ bespoke bridal transformations across Delhi NCR, Udaipur, Jaipur, Goa, and international destinations. Formally trained with premier master artists and certified in airbrush HD technique, delicate draping, and contemporary bridal hair design.'}
              </p>
            </motion.div>

            <motion.div
              className="pillar-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="pillar-card-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="pillar-title">Why Clients Trust Her</h3>
              <p className="pillar-desc">
                {content?.aboutWhyTrust ||
                  'Exclusive one-bride-a-day dedication for marquee wedding events, 100% premium luxury makeup vanity (Dior, Charlotte Tilbury, Tom Ford, NARS, Chanel), strict hygiene certifications, and a serene, calming presence when you need it most.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Checklist Section */}
      <section style={{ background: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tagline">The Bridal Journey</span>
            <h2 className="section-title">What Working With Ishita Feels Like</h2>
            <FloralDivider />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[
              {
                title: 'In-Depth Look Consultation',
                desc: 'Detailed discussion covering lehenga swatches, jewelry tones, lighting conditions, and skin goals well before the wedding.',
              },
              {
                title: 'Bespoke Skincare Regimen',
                desc: 'Tailored guidance to prep your skin barrier so makeup sits like a luminous second skin on the big day.',
              },
              {
                title: 'Zero Rush Guarantee',
                desc: 'Ishita gives ample buffer time for relaxing prep, dressing, and candid bridal portraits without wedding morning anxiety.',
              },
              {
                title: 'Master Dupatta & Jewelry Setting',
                desc: 'Flawless heavy dupatta pleating, matha patti pinning, and veil drape securing for total comfort and royal structure.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  padding: '1.25rem',
                  background: 'var(--color-ivory)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-gold-border)',
                }}
              >
                <CheckCircle2
                  size={22}
                  style={{ color: 'var(--color-champagne-gold)', flexShrink: 0, marginTop: '2px' }}
                />
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
