import jwt from 'jsonwebtoken';
import dataStore from '../services/dataStore.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Admin authentication required.',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'glowroot_ishita_luxury_beauty_secret_jwt_2026'
    );

    const admin = await dataStore.getAdminByUsername(decoded.username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token: account not recognized.',
      });
    }

    req.admin = {
      id: admin._id || admin.id,
      username: admin.username,
      email: admin.email,
      role: 'admin',
    };

    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed or session expired. Please log in again.',
    });
  }
};
