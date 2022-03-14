const request = require('supertest');
const express = require('express');

let app;

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

  jest.mock('../services/pg/photos', () => ({
    create: jest.fn((payload) => {
      if (payload[0].photourl === 'bad') {
        throw new Error('Mock Create Error');
      } else {
        return [
          {
            id: 1,
            category_id: 1,
            photo_url: 'mockUrl'
          }
        ];
      }
    }),
    get: jest.fn((catIdArr) => {
      if (catIdArr[0] === '999') {
        throw new Error('Mock Get Error');
      } else {
        return [
          {
            id: 1,
            category_id: 1,
            photo_url: 'mockUrl'
          },
          {
            id: 2,
            category_id: 1,
            photo_url: 'mockUrl2'
          }
        ];
      }
    }),
    remove: jest.fn((photoIdArr) => {
      if (photoIdArr[0] === '999') {
        throw new Error('Mock Remove Error');
      } else {
        return true;
      }
    })
  }));

  app = express();
  app.use(express.json());
  app.use(require('../photos'));
});

describe('Test Photos Route', () => {
  describe('Test Get', () => {
    it('should return some result', async () => {
      const result = await request(app).get('/').set({
        'x-categoryids': '1,2'
      });

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual([
        { category_id: 1, id: 1, photo_url: 'mockUrl' },
        { category_id: 1, id: 2, photo_url: 'mockUrl2' }
      ]);
    });

    it('should return status 500 when there is an error', async () => {
      const result = await request(app).get('/').set({
        'x-categoryids': '999,2'
      });

      expect(result.statusCode).toEqual(500);
    });
  });

  describe('Test Post', () => {
    it('should return result when successful create', async () => {
      const result = await request(app)
        .post('/')
        .send({
          photos: [
            {
              categoryid: 1,
              photourl: 'mockUrl'
            }
          ]
        });

      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual([
        { category_id: 1, id: 1, photo_url: 'mockUrl' }
      ]);
    });

    it('should return 500 when there is an error', async () => {
      const result = await request(app)
        .post('/')
        .send({
          photos: [
            {
              categoryid: 1,
              photourl: 'bad'
            }
          ]
        });

      expect(result.statusCode).toEqual(500);
    });
  });

  describe('Test Delete', () => {
    it('should return http status 204 when delete successful', async () => {
      const result = await request(app).delete('/').set({
        'x-photoids': '1,2'
      });

      expect(result.statusCode).toEqual(204);
    });

    it('should return status 500 when there is an error', async () => {
      const result = await request(app).delete('/').set({
        'x-photoids': '999,2'
      });

      expect(result.statusCode).toEqual(500);
    });
  });
});