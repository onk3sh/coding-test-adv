const request = require('supertest');
const express = require('express');

let app;

beforeAll(() => {
  jest.mock('../categories', () => {
    // Mock a category route
    const router = require('express').Router();
    router.get('/', async (req, res) => {
      return res.sendStatus(299); // Return status 299 for fun and validate mock
    });

    return router;
  });

  jest.mock('../photos', () => {
    //Mock a photo route
    const router = require('express').Router();
    router.get('/', async (req, res) => {
      return res.sendStatus(288); // Return status 288 for fun and validate mock is photo
    });

    return router;
  });

  app = express();
  app.use(require('../animal'));
});

// Purpose of this test to ensure parent route are expected
describe('Test Animal Parent Route', () => {
  it('should include a categories route ', async () => {
    const result = await request(app).get('/categories');
    expect(result.statusCode).toEqual(299);
  });

  it('should include a photos route', async () => {
    const result = await request(app).get('/photos');
    expect(result.statusCode).toEqual(288);
  });
});