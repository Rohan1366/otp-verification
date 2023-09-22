// Import the Mongoose library for MongoDB interaction.
const mongoose = require("mongoose");

// Define a schema for user documents.
const userSchema = new mongoose.Schema({
  // The user's mobile number.
  mobileNumber: {
    type: String,
    required: true, // Mobile number is required.
    unique: true, // Each mobile number should be unique.
    validate: {
      // Custom validator to enforce the format: +<country code><number>
      validator: (value) => {
        return /^\+\d{1,}[0-9]{9,}$/.test(value); // Regular expression to validate the format.
      },
      message: "Invalid mobile number format", // Error message for invalid format.
    },
  },
  // A flag indicating whether the user is verified (default is false).
  isVerified: {
    type: Boolean,
    default: false, // User starts as unverified.
  },
});

// Create a Mongoose model for User using the defined schema.
const UserModel = mongoose.model("User", userSchema);

// Export the UserModel for use in other parts of application.
module.exports = { UserModel };
