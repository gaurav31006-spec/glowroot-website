import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Calendar, MessageCircle } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on page change
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="Glowroot by Ishita">
          <div className="brand-title">
            Glowroot<span>.</span>
          </div>
          <div className="brand-sub">BY ISHITA • BRIDAL ARTISTRY</div>
        </Link>

        {/* Desktop Nav */}
        <nav>
          <ul className="nav-menu">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Work
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="/booking" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Booking
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Header Right Actions (Desktop + Sleek Mobile) */}
        <div className="navbar-right-actions">
          <Link to="/booking" className="btn btn-primary nav-cta-btn">
            <Sparkles size={13} className="nav-btn-icon" />
            <span className="desktop-btn-text">Book Appointment</span>
            <span className="mobile-btn-text">Book Now</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-nav-list">
            <li>
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                About Ishita
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Makeup Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                My Work / Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Client Reviews & Feedback
              </NavLink>
            </li>
            <li>
              <NavLink to="/booking" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Book Appointment
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Contact & Connect
              </NavLink>
            </li>
          </ul>

          <div className="mobile-cta-wrapper">
            <Link to="/booking" className="btn btn-primary mobile-drawer-btn">
              <Calendar size={15} />
              <span>Book Your Appointment</span>
            </Link>
            <a
              href="https://wa.me/917016774703?text=Hi%20Ishita,%20I%20would%20like%20to%20enquire%20about%20bridal%20makeup%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mobile-drawer-btn"
            >
              <MessageCircle size={15} />
              <span>WhatsApp: 7016774703</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
