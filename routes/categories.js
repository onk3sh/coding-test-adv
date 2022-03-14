/* eslint-disable comma-dangle */
const express = require('express');
const { body, header } = require('express-validator');
const authenticate = require('./middleware/authenticate');
const { create, get, remove } = require('./services/pg/categories');
const validateRequest = require('./middleware/validationRequest');

const router = express.Router();

router.get(
  '/',
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      const result = await get();
      return res.send(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  '/',
  authenticate,
  [body('category').isString().isLength({ min: 1, max: 255 })],
  validateRequest,
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      const result = await create(req.body.category);
      return res.status(201).send(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.delete(
  '/',
  authenticate,
  [header('x-categoryid').isNumeric()],
  validateRequest,
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async (req, res) => {
    try {
      await remove(req.headers['x-categoryid']);
      return res.sendStatus(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

module.exports = router;
