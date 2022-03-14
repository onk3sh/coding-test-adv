const express = require('express');

const AuthService = require('./services/auth');

const router = express.Router();

/* Get an auth token */
router.get('/', async (req, res) => {
  try {
    const token = AuthService.getToken();
    return res.send(token);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
