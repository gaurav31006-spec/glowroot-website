import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dataStore from '../services/dataStore.js';

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Admin ID / Username and Password.',
      });
    }

    const admin = await dataStore.getAdminByUsername(username.trim());
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Only authorized administrator access permitted.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password did not match.',
      });
    }

    const token = jwt.sign(
      {
        id: admin._id || admin.id,
        username: admin.username,
        role: 'admin',
      },
      process.env.JWT_SECRET || 'glowroot_ishita_luxury_beauty_secret_jwt_2026',
      { expiresIn: '7d' }
    );

    await dataStore.updateAdminLastLogin(admin._id || admin.id);

    // Set secure HTTP-only cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Welcome back, Ishita. Admin dashboard authorized.',
      token,
      admin: {
        id: admin._id || admin.id,
        username: admin.username,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Logout failed' });
  }
};
