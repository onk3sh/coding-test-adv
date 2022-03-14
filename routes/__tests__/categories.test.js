const request = require('supertest');
const express = require('express');

let app;

global.console.log = jest.fn();

beforeAll(() => {
  jest.mock(
    '../middleware/authenticate',
    () => jest.fn((req, res, next) => next()) // Mock Authenticate always pass
  );

  jest.mock(
    '../middleware/validationRequest',
    () => jest.fn((req, res, next) => next()) // Mock Validate Request always success
  );

  jest.mock('../util/shuffleArray', () => jest.fn((array) => array));

  jest.mock('../services/pg/categories', () => ({
    create: jest.fn((category) => {
      if (category === 'bad') {
        throw new Error('Mock Create Error');
      } else {
        return [
          {
            id: 1,
            category: 'mockCategory'
          }
        ];
      }
    }),
    get: jest.fn(() => {
      // Another possible way of implement various mock result when there is no param
      // Instead of using jest mockreturnresult
      // However a clean up is required once this is done
      // This could be achived via the mock itself
      if (process.env.testCatGetError === 'error') {
        delete process.env.testCatGetError;
        throw new Error('Mock Get Error');
      }

      return [{ id: 1, category: 'Cat1', id: 2, category: 'Cat2' }];
    }),
    remove: jest.fn((categoryId) => {
      if (categoryId === '999') {
        throw new Error('Mock Remove Error');
      } else {
        return true;
      }
    })
  }));

  app = express();
  app.use(express.json());
  app.use(require('../categories'));
});

describe('Test Categories Route', () => {
  describe('Test Get', () => {
    it('should return some result', async () => {
      const result = await request(app).get('/');
      expect(result.statusCode).toEqual(200);
    });

    it('should return status 500 when there is an error', async () => {
      // This is the other way to test multiple mock result without param
      process.env.testCatGetError = 'error';
      const result = await request(app).get('/');
      expect(result.statusCode).toEqual(500);
    });
  });

  describe('Test Post', () => {
    it('should return status 201 with result when create sucess', async () => {
      const result = await request(app).post('/').send({ category: 'good' });
      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual([{ category: 'mockCategory', id: 1 }]);
    });

    it('should return status 500 when there is an error', async () => {
      const result = await request(app).post('/').send({ category: 'bad' });
      expect(result.statusCode).toBe(500);
    });
  });

  describe('Test Remove', () => {
    it('should return status 204 when success remove', async () => {
      const result = await request(app).delete('/').set({
        'x-categoryid': 1
      });

      expect(result.statusCode).toBe(204);
    });

    it('should return status 500 when there is an error', async () => {
      const result = await request(app).delete('/').set({
        'x-categoryid': 999
      });

      expect(result.statusCode).toBe(500);
    });
  });
});