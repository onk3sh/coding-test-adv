const request = require('supertest');
const express = require('express');

let app;

global.console.log = jest.fn();
beforeAll(() => {
  jest.mock('../services/auth', () => ({
    getToken: jest
      .fn()
      .mockReturnValueOnce('Mocktoken')
      .mockImplementation(() => {
        throw new Error('Mock Auth Errro');
      })
  }));

  app = express();
  app.use(express.json());
  app.use(require('../auth'));
});

describe('Test Auth Route', () => {
  it('should get the token', async () => {
    const result = await request(app).get('/');
    expect(result.statusCode).toEqual(200);
    expect(result.text).toEqual('Mocktoken');
  });

  it('should return status 500 when there is an error', async () => {
    const result = await request(app).get('/');
    expect(result.statusCode).toEqual(500);
  });
});