const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDB = async (connectionString) => {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
