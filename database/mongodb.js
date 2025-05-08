import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("MongoDB URI is required in environment variables");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Recommended for most apps
            retryWrites: true,
            w: 'majority'
        });
        console.log(`Connected to Database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1); // Exit process on connection failure
    }
};

export default connectToDatabase;