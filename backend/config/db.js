import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from backend/.env regardless of where the command was launched
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

let isConnected = false;

// Helper to mask credentials when logging connection strings
export const sanitizeUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placehub';
  const maskedUri = sanitizeUri(uri);

  console.log(`[MongoDB] Attempting connection to: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout suitable for MongoDB Atlas SRV and TLS negotiation
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to database (${maskedUri}): ${error.message}`);
    console.log(`[PlaceHub Info] Running in InMemory/Local Fallback mode. The portal is fully functional with live seed data.`);
    console.log(`[PlaceHub Info] Tip: Set your MongoDB Atlas connection string in backend/.env: MONGODB_URI=mongodb+srv://...`);
    return false;
  }
};

export const getDBStatus = () => isConnected;

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};
