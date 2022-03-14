/* eslint-disable comma-dangle */
const express = require('express');
const { body, header } = require('express-validator');
const authenticate = require('./middleware/authenticate');
const { create, get, remove } = require('./services/pg/photos');
const validateRequest = require('./middleware/validationRequest');
const shuffleArray = require('./util/shuffleArray');

const router = express.Router();

router.get(
  '/',
  [header('x-categoryids').isString()],
  validateRequest,
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      const arrayOfCatId = req.headers['x-categoryids'].split(',');
      const results = await get(arrayOfCatId);
      shuffleArray(results);
      return res.send(results);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  '/',
  authenticate,
  [
    body('photos').isArray(),
    body('photos.*.categoryid').isNumeric(),
    body('photos.*.photourl').isURL()
  ],
  validateRequest,
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      const result = await create(req.body.photos);
      return res.status(201).send(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.delete(
  '/',
  authenticate,
  [header('x-photoids').isString()],
  validateRequest,
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      const arrayOfPhotoId = req.headers['x-photoids'].split(',');
      await remove(arrayOfPhotoId);
      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);
module.exports = router;
