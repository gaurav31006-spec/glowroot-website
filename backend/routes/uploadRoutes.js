import express from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/single', protectAdmin, (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename,
    });
  });
});

router.post('/multiple', protectAdmin, (req, res) => {
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select image files to upload.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urls = req.files.map((f) => ({
      url: `${protocol}://${host}/uploads/${f.filename}`,
      filename: f.filename,
    }));

    return res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully.`,
      urls,
    });
  });
});

export default router;
