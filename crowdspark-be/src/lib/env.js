const dotenv = require("dotenv");
dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};

module.exports = { ENV };
