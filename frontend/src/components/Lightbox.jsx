import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Lightbox = ({ items = [], currentIndex, isOpen, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || items.length === 0 || currentIndex === null) return null;

  const currentItem = items[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(24, 20, 18, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2020,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-champagne-gold)';
            e.currentTarget.style.color = '#1E1A18';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
        >
          <X size={20} />
        </button>

        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2010,
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2010,
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image & Caption Box */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '960px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
          }}
        >
          <motion.img
            key={currentItem?.image || currentItem?._id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            src={currentItem?.image}
            alt={currentItem?.title || 'Bridal Makeup'}
            style={{
              maxHeight: '62vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(197, 160, 89, 0.25)',
            }}
          />

          {/* Caption Details */}
          <div
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#FFFFFF',
              maxWidth: '650px',
              padding: '0 1rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.76rem',
                color: 'var(--color-gold-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.25rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Tag size={12} />
              <span>{currentItem?.category}</span>
              {currentItem?.clientName && <span>• {currentItem.clientName}</span>}
              <span style={{ opacity: 0.7 }}>
                ({currentIndex + 1} / {items.length})
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                color: '#FFFFFF',
                marginBottom: '0.25rem',
              }}
            >
              {currentItem?.title}
            </h3>

            {currentItem?.caption && (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#D8CFC4',
                  lineHeight: '1.45',
                  maxHeight: '4rem',
                  overflowY: 'auto',
                }}
              >
                {currentItem.caption}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
