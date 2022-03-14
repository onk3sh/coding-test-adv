const authService = require('../services/auth');

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = (req, res, next) => {
  const { authorization } = req.headers;

  // No authorization provided
  if (!authorization) {
    return res.sendStatus(401);
  }

  try {
    // Splits and take the next item as standard authorization format for BEARER TOKEN
    const authToken = authorization.split(' ')[1];

    const result = authService.validateToken(authToken);

    if (result) {
      return next();
    }
    // At this point authorization failed
    return res.sendStatus(401);
  } catch (error) {
    // When there is an error we assume authorization failed
    return res.sendStatus(401);
  }
};

module.exports = authenticate;
