import dataStore from '../services/dataStore.js';

export const createBooking = async (req, res) => {
  try {
    const { fullName, mobileNumber, email, service, eventDate, eventTime, eventLocation, message } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your Full Name.' });
    }

    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your Mobile Number.' });
    }

    // Mobile number validation (checks 10 digits or international format)
    const cleanPhone = mobileNumber.replace(/[\s\-\(\)\+]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile phone number.',
      });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Email Address.' });
    }

    if (!service || !service.trim()) {
      return res.status(400).json({ success: false, message: 'Please select a makeup service.' });
    }

    if (!eventDate) {
      return res.status(400).json({ success: false, message: 'Please select your Event Date.' });
    }

    if (!eventLocation || !eventLocation.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide the Event Location / City / Venue.' });
    }

    const booking = await dataStore.createBooking({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim().toLowerCase(),
      service: service.trim(),
      eventDate,
      eventTime: eventTime || '',
      eventLocation: eventLocation.trim(),
      message: message ? message.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Your booking enquiry has been received! Ishita will review the date and contact you directly via WhatsApp or phone.',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const bookings = await dataStore.getBookings({ status, date, search });
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await dataStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, privateNotes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof privateNotes === 'string') updateData.privateNotes = privateNotes;

    const updated = await dataStore.updateBooking(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Booking updated to ${status || 'current status'}.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await dataStore.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.status(200).json({
      success: true,
      message: 'Booking enquiry removed successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
