import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 3000,
          background: '#FFFFFF',
          border: `1px solid ${isSuccess ? 'var(--color-champagne-gold)' : '#E57373'}`,
          borderLeft: `4px solid ${isSuccess ? 'var(--color-champagne-gold)' : '#E57373'}`,
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          maxWidth: '420px',
        }}
      >
        {isSuccess ? (
          <CheckCircle2 size={20} color="var(--color-champagne-gold)" />
        ) : (
          <AlertCircle size={20} color="#E57373" />
        )}
        <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
