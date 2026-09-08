// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Check your .env file.');
  }
  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ MongoDB connection error: ${msg}`);
    process.exit(1);
  }
};

export default connectDB;
