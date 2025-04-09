const mongoose = require('mongoose');
const {MONGO_URL} = require("../config/server-Config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected from Kafka process ✅');
  } catch (err) {
    console.error('MongoDB connection error :', err);
    process.exit(1);
  }
};

module.exports = connectDB;
