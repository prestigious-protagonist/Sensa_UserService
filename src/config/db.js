const mongoose = require("mongoose");
const {MONGO_URL} = require("./server-Config")
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = connectDB;
