const mongoose = require("mongoose");
const { ENV } = require("../lib/env");

async function connectMongoDB() {
  try {
    await mongoose.connect(ENV.MONGO_URL);
    console.log("MongoDB connect success!");
  } catch (error) {
    console.log("MongoDB connect failed!");
  }
}

module.exports = connectMongoDB;
