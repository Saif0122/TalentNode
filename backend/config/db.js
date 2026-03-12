const mongoose = require('mongoose');

const connectDB = async () => {
  // Disable Mongoose buffering globally
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to DB Cluster');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected');
  });

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("⏳ Initiating MongoDB connection...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log(`✅ MongoDB Connection process complete. ReadyState: ${mongoose.connection.readyState}`);
  } catch (error) {
    console.error(`❌ Initial MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
