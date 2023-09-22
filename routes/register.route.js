// Import necessary libraries and modules
const express = require("express");
const { ipValidate } = require("../middlewares/ipValidate.middleware");
const registerRoute = express.Router();
const twilio = require("twilio");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { OtpModel } = require("../models/otp.model");
require("dotenv").config();

// Apply the 'ipValidate' middleware to validate IP address
registerRoute.use(ipValidate);

// Create a Twilio client using credentials from environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function for generating OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Route for sending OTP via SMS
registerRoute.post("/", async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if mobileNumber is not provided
    if (!mobileNumber)
      return res.status(400).json({
        error: "Mobile Number Missing",
        message: "Mobile number is required to send an OTP.",
      });

    let user = await UserModel.findOne({ mobileNumber });

    if (!user) {
      // If the user does not exist, create a new user
      user = new UserModel({ mobileNumber });
      // Save the new user in the database
      user = await user.save();
    }

    const userId = user._id;
    const otp = generateOTP();
    console.log(otp);
    const oldOTP = await OtpModel.findOne({ userId });

    // Handle rate limiting for OTP requests
    if (oldOTP) {
      const currentTime = new Date();
      let timeElapsed = oldOTP.expiresAt - currentTime;

      // Getting time interval in seconds
      timeElapsed = Math.floor(timeElapsed / 1000);
      if (timeElapsed > 0) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Please wait before requesting a new OTP",
          retryAfter: timeElapsed,
        });
      }
    }

    // Send OTP via Twilio SMS
    try {
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobileNumber,
      });
    } catch (err) {
      const errorMessage =
        err.code === 21608
          ? "Trial account, OTP only received on +918530528162 & +919766050490"
          : err.message;
      return res.status(err.status).json({ error: errorMessage });
    }

    // Save the new OTP in the database
    const hash = bcrypt.hashSync(otp, 3);
    if (oldOTP) {
      // Update the existing OTP with a new hash and extended expiration
      await OtpModel.findOneAndUpdate(
        { userId },
        {
          otp: hash,
          expiresAt: new Date(Date.now() + 60000), // Extend expiration by 60 seconds
        },
        { new: true }
      );
    } else {
      // Create a new OTP entry in the database
      const newOTP = new OtpModel({ userId, otp: hash });
      await newOTP.save();
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ massage: "Failed to send OTP!", error: error.message });
  }
});

// Route for verifying OTP
registerRoute.post("/otp", async (req, res) => {
  try {
    let { otp, mobileNumber } = req.body;

    // Check if mobileNumber is missing in the request body
    if (!mobileNumber) {
      return res.status(400).json({
        error: "Mobile Number Missing",
        message: "Mobile number is required for OTP verification.",
      });
    }

    // Check if OTP is missing in the request body
    if (!otp) {
      return res.status(400).json({
        error: "OTP Missing",
        message: "OTP is required for verification.",
      });
    }

    // Convert OTP to a string for comparison
    otp = otp.toString();

    // Find the user with the provided mobile number
    const user = await UserModel.findOne({ mobileNumber });

    // Check if the user exists
    if (!user)
      return res.status(404).json({
        error: "User not found!",
        message: `OTP not generated for ${mobileNumber}`,
      });

    // Check if the user account is already verified
    if (user.isVerified) {
      return res.status(200).json({
        message: "Account is already verified. You can proceed to log in.",
      });
    }

    // Get the user's unique identifier
    const userId = user._id;

    // Find the OTP entry in the database
    const dbOTP = await OtpModel.findOne({ userId });

    // Get the current time
    const currentTime = new Date();

    // Calculate the time elapsed since OTP expiration
    let timeElapsed = dbOTP.expiresAt - currentTime;

    // Calculate the time interval in seconds
    timeElapsed = Math.floor(timeElapsed / 1000);

    // Check if OTP has expired
    if (timeElapsed <= 0) {
      res.status(403).json({
        error: "OTP Expired",
        message: "The provided OTP has expired. Please request a new OTP.",
      });
      return;
    }

    // Compare the provided OTP with the stored OTP hash
    const verifyOTP = await bcrypt.compare(otp, dbOTP.otp);

    // If OTP is correct, mark the user account as verified
    if (verifyOTP) {
      await UserModel.findByIdAndUpdate(userId, {
        isVerified: true,
      });
      return res.status(200).json({
        message: "OTP verification successful. Account is now registered.",
      });
    } else {
      // If OTP is incorrect, return an error
      return res.status(400).json({
        error: "Wrong OTP",
        message: "The OTP provided is incorrect. Please enter the correct OTP.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// Export the registerRoute for use in other parts of application.
module.exports = { registerRoute };
