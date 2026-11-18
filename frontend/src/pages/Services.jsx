import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, Sparkles, ArrowRight, Calendar, Heart } from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import { getServices } from '../services/api';
import '../styles/services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesList();
  }, []);

  const fetchServicesList = async () => {
    try {
      setLoading(true);
      const res = await getServices(true);
      if (res.data?.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-page">
      {/* Services Hero */}
      <section className="services-hero">
        <div className="container">
          <span className="section-tagline">Bespoke Offerings</span>
          <h1 className="section-title">Makeup Artistry & Experiences</h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '680px', margin: '0 auto' }}>
            From high-definition regal bridal transformations to effortless cocktail glamour. Every
            service is designed with skin-first precision, premium luxury cosmetics, and
            unparalleled bridal care.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="services-catalog">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-champagne-gold)' }}>
              <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
              <p>Loading luxury services...</p>
            </div>
          ) : (
            <div className="services-full-list">
              {services.map((service, index) => {
                const isEven = index % 2 === 1;
                return (
                  <motion.div
                    key={service._id || service.id}
                    className={`service-feature-card ${isEven ? 'reverse' : ''}`}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Photograph */}
                    <div className="service-feature-img-wrap">
                      <img src={service.image} alt={service.name} />
                      <span
                        style={{
                          position: 'absolute',
                          top: '1.25rem',
                          left: '1.25rem',
                          background: 'rgba(253, 251, 247, 0.95)',
                          border: '1px solid var(--color-gold-border)',
                          padding: '0.4rem 1rem',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-champagne-gold)',
                        }}
                      >
                        {service.category}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="service-feature-body">
                      <div className="service-badge-row">
                        {service.duration && (
                          <span className="service-duration-badge">
                            <Clock size={14} />
                            <span>{service.duration}</span>
                          </span>
                        )}
                      </div>

                      <h2 className="service-feature-title">{service.name}</h2>
                      <p className="service-feature-desc">
                        {service.fullDescription || service.shortDescription}
                      </p>

                      {/* Inclusions */}
                      {service.includes && service.includes.length > 0 && (
                        <div>
                          <h4 className="service-includes-title">Experience Includes:</h4>
                          <ul className="service-includes-list">
                            {service.includes.map((inc, incIdx) => (
                              <li key={incIdx} className="service-includes-item">
                                <Check size={16} />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pricing and Action */}
                      <div className="service-action-row">
                        <div className="service-price-block">
                          {service.startingPrice ? (
                            <>
                              <span className="service-price-tag">Starting Investment</span>
                              <span className="service-price-num">
                                ₹{service.startingPrice.toLocaleString('en-IN')}
                              </span>
                            </>
                          ) : (
                            <span
                              style={{
                                fontStyle: 'italic',
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.92rem',
                              }}
                            >
                              Price upon customized consultation
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/booking?service=${encodeURIComponent(service.name)}`}
                          className="btn btn-primary"
                        >
                          <Calendar size={17} />
                          <span>Book This Service</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Personalized Vanity Guarantee */}
      <section style={{ background: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
          <span className="section-tagline">100% Authentic Luxury</span>
          <h2 className="section-title">The Vanity Brands Ishita Uses</h2>
          <FloralDivider />
          <p className="section-description" style={{ marginBottom: '2.5rem' }}>
            We use only genuine, sealed, dermatologically tested luxury cosmetics sourced from
            official flagships worldwide.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
              flexWrap: 'wrap',
              opacity: 0.8,
            }}
          >
            {['DIOR', 'CHARLOTTE TILBURY', 'TOM FORD', 'CHANEL', 'NARS', 'PAT McGRATH', 'M.A.C'].map(
              (brand, bIdx) => (
                <span
                  key={bIdx}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.15em',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
