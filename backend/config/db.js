import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowroot';
    const isAtlas = uri.startsWith('mongodb+srv://');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 2500, // Generous timeout for Atlas cloud SSL handshake
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to MongoDB (${error.message}). Falling back to persistent file store.`);
    return false;
  }
};

export default connectDB;
