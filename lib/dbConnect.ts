import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectMongoDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI || "", {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.error("database connection failed", error);
  }
}

export default connectMongoDB;
