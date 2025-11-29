const Groq = require('groq-sdk');
require('dotenv').config();

// Init Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});