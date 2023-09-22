// Import the Mongoose library
const mongoose = require("mongoose");

// Load environment variables from a .env file
require("dotenv").config();

// Establish a connection to the MongoDB database using the URL from the environment variables
const connection = mongoose.connect(process.env.URL);

// Export the connection object so it can be used in other parts of application
mongoose.exports = { connection };
