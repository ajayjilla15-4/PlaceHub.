import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placehub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to avoid hanging if offline
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.log(`[PlaceHub Info] Running in InMemory/Local Fallback mode. The portal is fully functional with live seed data.`);
    console.log(`[PlaceHub Info] Tip: You can connect your free MongoDB Atlas cluster by setting MONGODB_URI in backend/.env`);
    return false;
  }
};

export const getDBStatus = () => isConnected;
