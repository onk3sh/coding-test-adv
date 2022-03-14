global.console.error = jest.fn();
beforeAll(() => {
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn((data, key, options) => {
      if (key === 'bad') {
        throw new Error('Mock Sign Error');
      } else {
        return 'SomeMockToken';
      }
    }),
    verify: jest.fn((token) => {
      if (token === 'good') {
        return true;
      } else {
        throw new Error('Mock Verify Error');
      }
    })
  }));
});

describe('Test Auth', () => {
  describe('Test Get token', () => {
    it('should return a token', () => {
      const { getToken } = require('../auth');
      const result = getToken();

      expect(result).toBe('SomeMockToken');
    });

    it('should throw an error', () => {
      const { getToken } = require('../auth');
      process.env.SIGNING_KEY = 'bad';
      try {
        getToken();
      } catch (error) {
        expect(error.message).toMatch('Mock Sign Error');
      }
    });
  });

  describe('Test Validate Token', () => {
    it('should return true when validate success', () => {
      const { validateToken } = require('../auth');

      const result = validateToken('good');
      expect(result).toBeTruthy();
    });

    it('should return false when validate failed', () => {
      const { validateToken } = require('../auth');

      const result = validateToken('bad');
      expect(result).toBeFalsy();
    });
  });
});
