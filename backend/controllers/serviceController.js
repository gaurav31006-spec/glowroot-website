import dataStore from '../services/dataStore.js';

export const getServices = async (req, res) => {
  try {
    const onlyActive = req.query.active === 'true';
    const services = await dataStore.getServices(onlyActive);
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await dataStore.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, category, shortDescription, fullDescription, startingPrice, priceNote, duration, includes, image, isActive } = req.body;

    if (!name || !shortDescription || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, short description, and image photograph are required.',
      });
    }

    const newService = await dataStore.createService({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || 'Bridal',
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      startingPrice: startingPrice ? Number(startingPrice) : null,
      priceNote: priceNote || '',
      duration: duration || '2.5 - 3.5 Hours',
      includes: Array.isArray(includes) ? includes : typeof includes === 'string' ? includes.split('\n').filter(Boolean) : [],
      image,
      isActive: isActive !== false,
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: newService,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const updated = await dataStore.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deleted = await dataStore.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
