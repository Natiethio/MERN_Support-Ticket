const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Debug logs to check environment variables
// console.log("Cloudinary Config:", {
//   CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   API_KEY: process.env.CLOUDINARY_API_KEY,
//   API_SECRET: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
