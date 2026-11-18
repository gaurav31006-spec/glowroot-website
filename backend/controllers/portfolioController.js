import dataStore from '../services/dataStore.js';

export const getPortfolio = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const portfolio = await dataStore.getPortfolio({ category, featured });
    return res.status(200).json({
      success: true,
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const item = await dataStore.getPortfolioById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    const { title, category, image, caption, description, clientName, isFeatured } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title and image photograph are required.',
      });
    }

    const newItem = await dataStore.createPortfolio({
      title,
      category: category || 'Bridal',
      image,
      caption: caption || '',
      description: description || '',
      clientName: clientName || '',
      isFeatured: isFeatured === true || isFeatured === 'true',
    });

    return res.status(201).json({
      success: true,
      message: 'Portfolio photograph added successfully.',
      data: newItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const updated = await dataStore.updatePortfolio(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Portfolio photograph updated successfully.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const deleted = await dataStore.deletePortfolio(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderPortfolio = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds array required' });
    }
    await dataStore.reorderPortfolio(orderedIds);
    return res.status(200).json({
      success: true,
      message: 'Portfolio display order updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
