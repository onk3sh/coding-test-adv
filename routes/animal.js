const express = require('express');

const categories = require('./categories');
const photos = require('./photos');

const router = express.Router();

/* Get an auth token */
router.use('/categories', categories);
router.use('/photos', photos);

module.exports = router;
