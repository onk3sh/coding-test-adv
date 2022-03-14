/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
const jwt = require('jsonwebtoken');

/**
 * Returns JWT String
 * @returns {string}
 */
const getToken = () => {
  try {
    return jwt.sign({ user: 'somevaliduser' }, process.env.SIGNING_KEY, {
      expiresIn: '2 days'
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Validate JWT
 * @param {string} token
 * @returns {boolean}
 */
const validateToken = (token) => {
  try {
    jwt.verify(token, process.env.SIGNING_KEY);
    return true;
  } catch (error) {
    return false; // Fail to verify
  }
};

module.exports = { getToken, validateToken };
