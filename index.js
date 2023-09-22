// Import necessary libraries and modules
const express = require("express");
const cors = require("cors");

// Import the 'connection' object for database connection
const { connection } = require("./configs/db");

// Import the 'registerRoute' for user registration and OTP verification
const { registerRoute } = require("./routes/register.route");

// Create an instance of the Express application
const app = express();

// Common middlewares for request processing
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Mount the 'registerRoute' router for user registration and OTP verification
app.use("/register", registerRoute);

// Endpoint to check if the server is running
app.get("*", async (req, res) => {
  res.send("Welcome to Cuvette!"); // Send a welcome message
});

// Start the server and listen on the specified port
app.listen(process.env.PORT, async (req, res) => {
  try {
    // Wait for the database connection to establish
    await connection;
    console.log("Cuvette server Connected!"); // Log a message when the server is successfully connected to the database
  } catch (error) {
    console.log(error); // Log any errors that occur during server startup
  }
});
