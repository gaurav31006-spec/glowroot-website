import React from 'react';

const FloralDivider = ({ className = '', style = {} }) => {
  return (
    <div className={`floral-divider ${className}`} style={style}>
      <span className="floral-divider-line"></span>
      <svg
        width="28"
        height="18"
        viewBox="0 0 28 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: 'var(--color-champagne-gold)' }}
      >
        <path
          d="M14 0C14 0 11.5 6 4 7C11 9 14 18 14 18C14 18 17 9 24 7C16.5 6 14 0 14 0Z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="14" cy="9" r="1.75" fill="#FFFFFF" />
        <circle cx="2" cy="7" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="26" cy="7" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
      <span className="floral-divider-line"></span>
    </div>
  );
};

export default FloralDivider;
