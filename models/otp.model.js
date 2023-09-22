// Import the Mongoose library for MongoDB interaction.
const mongoose = require("mongoose");

// Import Joi for validation (assuming it will be used for validation elsewhere in your code).
const Joi = require("joi");

// Define a schema for OTP (One-Time Password) documents.
const otpSchema = new mongoose.Schema({
  // Reference to the user associated with the OTP.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The OTP value itself.
  otp: {
    type: String,
    required: true,
  },
  // The expiration time for the OTP, set to 1 minute (60000 milliseconds) from creation by default.
  expiresAt: {
    type: Date,
    default: () => new Date(new Date().getTime() + 60000),
  },
});

// Create a Mongoose model for OTP using the defined schema.
const OtpModel = mongoose.model("OTP", otpSchema);

// Export the OtpModel for use in other parts of application.
module.exports = { OtpModel };
