import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Phone,
  Mail,
  MessageCircle,
  Lock,
  Heart,
  Plane,
  Star,
} from 'lucide-react';
import '../styles/footer.css';

const Footer = ({ content = {} }) => {
  const currentYear = new Date().getFullYear();

  const phone = content?.phone || '+91 70167 74703';
  const rawWhatsapp = (content?.whatsapp || '7016774703').replace(/[^0-9]/g, '');
  const instagramHandle = content?.instagramHandle || '@glowrootbyishita';
  const instagramUrl = content?.instagramUrl || 'https://www.instagram.com/glowrootbyishita';

  return (
    <footer className="site-footer">
      <div className="footer-top-accent"></div>
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-title">
              Glowroot<span>.</span>
            </Link>
            <div className="footer-logo-sub">BY ISHITA • BRIDAL ARTISTRY</div>
            <p className="footer-bio">
              Where every bride finds her glow. Dedicated to bespoke high-definition bridal styling,
              dewy skin-first elegance, and timeless grace for weddings across India and destinations worldwide.
            </p>
            <div className="footer-social-icons">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={`Instagram ${instagramHandle}`}
              >
                <Instagram size={18} />
              </a>
              <a
                href={`https://wa.me/${rawWhatsapp}?text=Hi%20Ishita,%20I%20am%20interested%20in%20bridal%20makeup.`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp Glowroot"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={`mailto:${content?.email || 'ishita@glowroot.in'}`}
                className="footer-social-link"
                aria-label="Email Glowroot"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Ishita</Link>
              </li>
              <li>
                <Link to="/services">Makeup Services</Link>
              </li>
              <li>
                <Link to="/portfolio">Portfolio Gallery</Link>
              </li>
              <li>
                <Link to="/booking">Book Appointment</Link>
              </li>
              <li>
                <Link to="/feedback" style={{ color: 'var(--color-champagne-gold)', fontWeight: 500 }}>
                  <Star size={13} fill="currentColor" />
                  <span>Leave A Review</span>
                </Link>
              </li>
              <li>
                <Link to="/contact">Contact & Connect</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Signature Services */}
          <div>
            <h4 className="footer-col-title">Signature Artistry</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/services">Bridal Makeup</Link>
              </li>
              <li>
                <Link to="/services">Engagement Glam</Link>
              </li>
              <li>
                <Link to="/services">Reception Aesthetics</Link>
              </li>
              <li>
                <Link to="/services">Cocktail / Sangeet</Link>
              </li>
              <li>
                <Link to="/services">Party Styling</Link>
              </li>
              <li>
                <Link to="/booking">Destination Weddings</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Connect */}
          <div>
            <h4 className="footer-col-title">Direct Connect</h4>
            <div className="footer-contact-item">
              <Phone size={18} />
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
            <div className="footer-contact-item">
              <MessageCircle size={18} />
              <a
                href={`https://wa.me/${rawWhatsapp}?text=Hi%20Ishita,%20I%20would%20like%20to%20enquire%20about%20bridal%20makeup.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: +91 {rawWhatsapp.slice(-10)}
              </a>
            </div>
            <div className="footer-contact-item">
              <Instagram size={18} />
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                {instagramHandle}
              </a>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} />
              <a href={`mailto:${content?.email || 'ishita@glowroot.in'}`}>
                {content?.email || 'ishita@glowroot.in'}
              </a>
            </div>
            <div className="footer-contact-item" style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--color-dusty-rose-light)' }}>
              <Plane size={15} style={{ color: 'var(--color-dusty-rose-light)' }} />
              <span>On-Location Bridal Artistry Pan-India & Worldwide</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {currentYear} Glowroot by Ishita. All Rights Reserved. Crafted with{' '}
            <Heart size={14} style={{ color: 'var(--color-dusty-rose)', verticalAlign: 'middle' }} /> for brides worldwide.
          </div>
          <div>
            {/* Small Discrete Admin Access */}
            <Link to="/admin/login" className="admin-link-btn" title="Ishita Admin Portal">
              <Lock size={13} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
