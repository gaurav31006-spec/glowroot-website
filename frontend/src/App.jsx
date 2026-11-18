import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminServices from './pages/admin/AdminServices';
import AdminContent from './pages/admin/AdminContent';

import { getContent } from './services/api';
import './styles/global.css';

// Public layout wrapper
const PublicLayout = ({ children, content }) => {
  return (
    <div className="site-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer content={content} />
    </div>
  );
};

function App() {
  const [content, setContent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Only fetch content if on public pages
    if (!location.pathname.startsWith('/admin')) {
      fetchGlobalContent();
    }
  }, [location.pathname]);

  const fetchGlobalContent = async () => {
    try {
      const res = await getContent();
      if (res.data?.success) {
        setContent(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching global content:', e);
    }
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayout content={content}>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout content={content}>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/services"
        element={
          <PublicLayout content={content}>
            <Services />
          </PublicLayout>
        }
      />
      <Route
        path="/portfolio"
        element={
          <PublicLayout content={content}>
            <Portfolio />
          </PublicLayout>
        }
      />
      <Route
        path="/feedback"
        element={
          <PublicLayout content={content}>
            <Feedback />
          </PublicLayout>
        }
      />
      <Route
        path="/booking"
        element={
          <PublicLayout content={content}>
            <Booking />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout content={content}>
            <Contact />
          </PublicLayout>
        }
      />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="content" element={<AdminContent />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
