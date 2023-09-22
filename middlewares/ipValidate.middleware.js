// Import the 'ipinfo' library, which is presumably used to retrieve information about an IP address.
const ipinfo = require("ipinfo");

// Middleware function for IP validation............
const ipValidate = (req, res, next) => {
  // Extract the IP address from the 'req' object.
  const { ip } = req;

  // Use the 'ipinfo' library to retrieve information about the provided IP address.
  ipinfo(ip, (err, data) => {
    if (err) {
      // Handle the server-side error here...
      return res.status(500).send({ IPRetrievalError: err });
    } else if (data.error) {
      // Handle the client-side error here...
      return res.status(data.status).send({ IPRetrievalError: data.error });
    } else {
      // Handle the expected response here...

      // Attach the IP information to the 'req.body' object for later use.
      req.body.ipinfo = data;
      // Continue with the next middleware or route handler.
      next();
      return;
    }
  });
};

// Export the 'ipValidate' middleware for use in other parts of application.
module.exports = { ipValidate };
