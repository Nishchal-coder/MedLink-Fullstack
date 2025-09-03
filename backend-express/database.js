const mongoose = require('mongoose');

/**
 * Database Connection Configuration
 * Connects to MongoDB Atlas using environment variable MONGO_URI
 * Includes proper error handling and connection logging
 */
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    // Connection options for MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };
    
    // Attempt to connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoURI, options);
    
    // Log successful connection
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📊 Database Name:', conn.connection.name);
    console.log('🔗 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    console.error('🔍 Full error details:', error);
    
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
