const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanitary_ware_store';
  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice] Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[MongoDB Notice] Using built-in high-performance memory store for POS operations.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
