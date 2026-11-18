import dataStore from '../services/dataStore.js';

export const getContent = async (req, res) => {
  try {
    const content = await dataStore.getContent();
    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updated = await dataStore.updateContent(req.body);
    return res.status(200).json({
      success: true,
      message: 'Website content updated successfully.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { clientName, eventType, reviewText, rating } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name.' });
    }
    if (!reviewText || !reviewText.trim()) {
      return res.status(400).json({ success: false, message: 'Please write your review / feedback.' });
    }

    const newReview = await dataStore.addFeedback({
      clientName,
      eventType: eventType || 'Bridal Glam',
      reviewText,
      rating: rating || 5,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your beautiful review! It has been posted to our home page.',
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOverviewStats = async (req, res) => {
  try {
    const stats = await dataStore.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
