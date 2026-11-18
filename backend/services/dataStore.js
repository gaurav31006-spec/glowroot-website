import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { getInitialData } from '../seeds/seedData.js';
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import Portfolio from '../models/Portfolio.js';
import Booking from '../models/Booking.js';
import Content from '../models/Content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');

class DataStore {
  constructor() {
    this.memoryData = null;
    this.init();
  }

  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  init() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.memoryData = JSON.parse(raw);
      } else {
        this.memoryData = getInitialData();
        this.saveToFile();
      }
    } catch (err) {
      console.error('Error initializing file dataStore:', err);
      this.memoryData = getInitialData();
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  // Seed MongoDB if empty when connected
  async syncToMongoIfEmpty() {
    if (!this.isMongoConnected()) return;
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        console.log('[MongoDB] Seeding initial data to MongoDB Atlas...');
        const init = getInitialData();
        const cleanObj = (item) => {
          if (!item) return item;
          const copy = { ...item };
          delete copy._id;
          delete copy.id;
          return copy;
        };

        const adminData = Array.isArray(init.admin) ? init.admin[0] : init.admin;
        await Admin.collection.insertOne(cleanObj(adminData));
        await Service.insertMany(init.services.map(cleanObj));
        await Portfolio.insertMany(init.portfolio.map(cleanObj));
        if (init.bookings && init.bookings.length) {
          await Booking.insertMany(init.bookings.map(cleanObj));
        }
        await Content.create(cleanObj(init.content));
        console.log('[MongoDB] Initial data successfully seeded to MongoDB Atlas.');
      }
    } catch (err) {
      console.error('[MongoDB] Error during syncToMongoIfEmpty:', err.message);
    }
  }

  // ADMIN
  async getAdminByUsername(username) {
    if (this.isMongoConnected()) {
      return await Admin.findOne({ username });
    }
    const admin = (this.memoryData.admin || []).find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    );
    return admin || null;
  }

  async updateAdminLastLogin(id) {
    if (this.isMongoConnected()) {
      await Admin.findByIdAndUpdate(id, { lastLogin: new Date() });
      return;
    }
    const admin = (this.memoryData.admin || []).find((a) => a._id === id || a.id === id);
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.saveToFile();
    }
  }

  // SERVICES
  async getServices(onlyActive = false) {
    if (this.isMongoConnected()) {
      const query = onlyActive ? { isActive: true } : {};
      return await Service.find(query).sort({ order: 1, createdAt: 1 });
    }
    let list = this.memoryData.services || [];
    if (onlyActive) {
      list = list.filter((s) => s.isActive !== false);
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getServiceById(id) {
    if (this.isMongoConnected()) {
      return await Service.findById(id);
    }
    return (this.memoryData.services || []).find((s) => s._id === id || s.id === id) || null;
  }

  async createService(data) {
    if (this.isMongoConnected()) {
      return await Service.create(data);
    }
    const newService = {
      ...data,
      id: 'srv-' + Date.now(),
      _id: 'srv-' + Date.now(),
      order: (this.memoryData.services?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryData.services.push(newService);
    this.saveToFile();
    return newService;
  }

  async updateService(id, data) {
    if (this.isMongoConnected()) {
      return await Service.findByIdAndUpdate(id, data, { new: true });
    }
    const index = (this.memoryData.services || []).findIndex((s) => s._id === id || s.id === id);
    if (index === -1) return null;
    this.memoryData.services[index] = {
      ...this.memoryData.services[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile();
    return this.memoryData.services[index];
  }

  async deleteService(id) {
    if (this.isMongoConnected()) {
      return await Service.findByIdAndDelete(id);
    }
    const index = (this.memoryData.services || []).findIndex((s) => s._id === id || s.id === id);
    if (index === -1) return null;
    const deleted = this.memoryData.services.splice(index, 1)[0];
    this.saveToFile();
    return deleted;
  }

  // PORTFOLIO
  async getPortfolio({ category, featured } = {}) {
    if (this.isMongoConnected()) {
      const query = {};
      if (category && category.toLowerCase() !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (featured === true || featured === 'true') {
        query.isFeatured = true;
      }
      return await Portfolio.find(query).sort({ order: 1, createdAt: -1 });
    }
    let list = this.memoryData.portfolio || [];
    if (category && category.toLowerCase() !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured === true || featured === 'true') {
      list = list.filter((p) => p.isFeatured === true);
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getPortfolioById(id) {
    if (this.isMongoConnected()) {
      return await Portfolio.findById(id);
    }
    return (this.memoryData.portfolio || []).find((p) => p._id === id || p.id === id) || null;
  }

  async createPortfolio(data) {
    if (this.isMongoConnected()) {
      return await Portfolio.create(data);
    }
    const newPort = {
      ...data,
      id: 'port-' + Date.now(),
      _id: 'port-' + Date.now(),
      order: (this.memoryData.portfolio?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memoryData.portfolio.push(newPort);
    this.saveToFile();
    return newPort;
  }

  async updatePortfolio(id, data) {
    if (this.isMongoConnected()) {
      return await Portfolio.findByIdAndUpdate(id, data, { new: true });
    }
    const index = (this.memoryData.portfolio || []).findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;
    this.memoryData.portfolio[index] = {
      ...this.memoryData.portfolio[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile();
    return this.memoryData.portfolio[index];
  }

  async deletePortfolio(id) {
    if (this.isMongoConnected()) {
      return await Portfolio.findByIdAndDelete(id);
    }
    const index = (this.memoryData.portfolio || []).findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;
    const deleted = this.memoryData.portfolio.splice(index, 1)[0];
    this.saveToFile();
    return deleted;
  }

  async reorderPortfolio(orderedIds) {
    if (this.isMongoConnected()) {
      for (let i = 0; i < orderedIds.length; i++) {
        await Portfolio.findByIdAndUpdate(orderedIds[i], { order: i + 1 });
      }
      return true;
    }
    orderedIds.forEach((id, idx) => {
      const item = (this.memoryData.portfolio || []).find((p) => p._id === id || p.id === id);
      if (item) item.order = idx + 1;
    });
    this.saveToFile();
    return true;
  }

  // BOOKINGS
  async getBookings({ status, date, search } = {}) {
    if (this.isMongoConnected()) {
      const query = {};
      if (status && status !== 'All') {
        query.status = status;
      }
      if (date) {
        query.eventDate = date;
      }
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobileNumber: { $regex: search, $options: 'i' } },
          { eventLocation: { $regex: search, $options: 'i' } },
        ];
      }
      return await Booking.find(query).sort({ createdAt: -1 });
    }
    let list = this.memoryData.bookings || [];
    if (status && status !== 'All') {
      list = list.filter((b) => b.status === status);
    }
    if (date) {
      list = list.filter((b) => b.eventDate === date);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.fullName?.toLowerCase().includes(s) ||
          b.email?.toLowerCase().includes(s) ||
          b.mobileNumber?.toLowerCase().includes(s) ||
          b.eventLocation?.toLowerCase().includes(s)
      );
    }
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getBookingById(id) {
    if (this.isMongoConnected()) {
      return await Booking.findById(id);
    }
    return (this.memoryData.bookings || []).find((b) => b._id === id || b.id === id) || null;
  }

  async createBooking(data) {
    if (this.isMongoConnected()) {
      return await Booking.create(data);
    }
    const newBooking = {
      ...data,
      id: 'book-' + Date.now(),
      _id: 'book-' + Date.now(),
      status: 'Pending',
      privateNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!this.memoryData.bookings) this.memoryData.bookings = [];
    this.memoryData.bookings.unshift(newBooking);
    this.saveToFile();
    return newBooking;
  }

  async updateBooking(id, updateData) {
    if (this.isMongoConnected()) {
      return await Booking.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = (this.memoryData.bookings || []).findIndex((b) => b._id === id || b.id === id);
    if (index === -1) return null;
    this.memoryData.bookings[index] = {
      ...this.memoryData.bookings[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile();
    return this.memoryData.bookings[index];
  }

  async deleteBooking(id) {
    if (this.isMongoConnected()) {
      return await Booking.findByIdAndDelete(id);
    }
    const index = (this.memoryData.bookings || []).findIndex((b) => b._id === id || b.id === id);
    if (index === -1) return null;
    const deleted = this.memoryData.bookings.splice(index, 1)[0];
    this.saveToFile();
    return deleted;
  }

  // WEBSITE CONTENT
  async getContent() {
    if (this.isMongoConnected()) {
      let content = await Content.findOne();
      if (!content) {
        content = await Content.create(getInitialData().content);
      }
      return content;
    }
    if (!this.memoryData.content) {
      this.memoryData.content = getInitialData().content;
      this.saveToFile();
    }
    return this.memoryData.content;
  }

  async updateContent(data) {
    if (this.isMongoConnected()) {
      let content = await Content.findOne();
      if (!content) {
        return await Content.create(data);
      }
      Object.assign(content, data);
      await content.save();
      return content;
    }
    this.memoryData.content = {
      ...this.memoryData.content,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveToFile();
    return this.memoryData.content;
  }

  async addFeedback(review) {
    const newTestimonial = {
      id: 'test-' + Date.now(),
      clientName: review.clientName.trim(),
      eventType: review.eventType?.trim() || 'Bridal Makeup',
      reviewText: review.reviewText.trim(),
      rating: Number(review.rating) || 5,
      date: review.date || 'Recent Bride',
      avatar: review.avatar || '',
      createdAt: new Date().toISOString(),
    };

    if (this.isMongoConnected()) {
      let content = await Content.findOne();
      if (!content) {
        content = await Content.create(getInitialData().content);
      }
      content.testimonials.unshift(newTestimonial);
      await content.save();
      return newTestimonial;
    }

    if (!this.memoryData.content) {
      this.memoryData.content = getInitialData().content;
    }
    if (!this.memoryData.content.testimonials) {
      this.memoryData.content.testimonials = [];
    }
    this.memoryData.content.testimonials.unshift(newTestimonial);
    this.saveToFile();
    return newTestimonial;
  }

  // OVERVIEW STATS
  async getStats() {
    const bookings = await this.getBookings();
    const portfolio = await this.getPortfolio();
    const services = await this.getServices();

    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const approved = bookings.filter((b) => b.status === 'Approved').length;
    const completed = bookings.filter((b) => b.status === 'Completed').length;
    const rejected = bookings.filter((b) => b.status === 'Rejected').length;

    return {
      totalBookings: bookings.length,
      pendingBookings: pending,
      approvedBookings: approved,
      completedBookings: completed,
      rejectedBookings: rejected,
      totalPortfolioImages: portfolio.length,
      totalServices: services.length,
    };
  }
}

export const dataStore = new DataStore();
export default dataStore;
