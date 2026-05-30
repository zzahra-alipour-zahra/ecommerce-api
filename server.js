
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app/app');

const startServer = async () => {
  try {
    mongoose.set('strictQuery', false);

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.DATABASE_LOCAL);

    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 7000;

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', err => {
      console.log('UNHANDLED REJECTION! Shutting down...');
      console.log(err.name, err.message);

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (err) {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
