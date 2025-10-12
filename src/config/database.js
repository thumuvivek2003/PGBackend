import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(
      "MONGO_URI from env:",
      process.env.MONGO_URI ? "✅ Loaded" : "❌ Undefined",
      process.env.MONGO_URI
    );

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
