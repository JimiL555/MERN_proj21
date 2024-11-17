const jwt = require('jsonwebtoken');

const secret = 'your-secret-key'; // Make sure this matches the one used in signToken
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If token is in the "Bearer <token>" format, remove "Bearer"
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req; // If no token, return the request object as is
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach the user data to the request object
    } catch (err) {
      console.log('Invalid token', err);
    }

    return req; // Return the request object, with user if available
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};