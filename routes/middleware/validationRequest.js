const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  return next();
};

module.exports = validateRequest;
