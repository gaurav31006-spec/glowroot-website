import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';
import FloralDivider from '../components/FloralDivider';
import Lightbox from '../components/Lightbox';
import { getPortfolio } from '../services/api';
import '../styles/portfolio.css';

const CATEGORIES = ['All', 'Bridal', 'Engagement', 'Reception', 'Cocktail', 'Party'];

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await getPortfolio('All');
      if (res.data?.success) {
        setPortfolio(res.data.data);
        setFilteredItems(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setFilteredItems(portfolio);
    } else {
      setFilteredItems(
        portfolio.filter((item) => item.category?.toLowerCase() === cat.toLowerCase())
      );
    }
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="portfolio-page">
      {/* Portfolio Hero */}
      <section className="portfolio-hero">
        <div className="container">
          <span className="section-tagline">Visual Archive</span>
          <h1 className="section-title">Actual Bridal & Event Work</h1>
          <FloralDivider />
          <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
            A curated collection of real brides, wedding festivities, and bespoke evening aesthetics
            curated by Ishita. Click any photograph to view high-resolution details.
          </p>

          {/* Filter Bar */}
          <div className="filter-tabs-wrapper">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`filter-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Image Gallery */}
      <section className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-champagne-gold)' }}>
            <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p>Loading photography gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 0',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--color-gold-border)',
              margin: '2rem 0',
            }}
          >
            <ImageIcon size={48} style={{ color: 'var(--color-champagne-gold)', marginBottom: '1rem', opacity: 0.7 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              No photographs in this category yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Photographs for this category will be uploaded shortly by Ishita.
            </p>
          </div>
        ) : (
          <motion.div layout className="masonry-gallery">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  key={item._id || item.id}
                  className="masonry-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={item.image}
                    alt={item.title || 'Bridal work'}
                    className="masonry-img"
                    loading="lazy"
                  />
                  <div className="masonry-overlay">
                    <div className="masonry-zoom-icon">
                      <Maximize2 size={18} />
                    </div>
                    <span className="masonry-category-pill">{item.category}</span>
                    <h3 className="masonry-title">{item.title}</h3>
                    {item.clientName && (
                      <span
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--color-dusty-rose-light)',
                          marginBottom: '4px',
                          display: 'block',
                        }}
                      >
                        Client: {item.clientName}
                      </span>
                    )}
                    {item.caption && <p className="masonry-caption">{item.caption}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Lightbox Component */}
      <Lightbox
        items={filteredItems}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % filteredItems.length)}
        onPrev={() =>
          setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
        }
      />
    </div>
  );
};

export default Portfolio;
