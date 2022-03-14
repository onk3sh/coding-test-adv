beforeAll(() => {
  jest.mock('pg', () => ({
    Pool: jest.fn().mockImplementation(() => ({
      connect: jest.fn()
    }))
  }));
});

describe('Test PG Connection', () => {
  describe('Test connect', () => {
    it('should call connect from pool', async () => {
      const connectFn = jest.fn();
      global.gPgPool = {
        connect: connectFn
      };

      const { connect } = require('../connection');
      await connect();
      delete global.gPgPool;
      expect(connectFn).toHaveBeenCalled();
    });

    it('should create new and call pool', async () => {
      const pg = require('pg');
      const { connect } = require('../connection');
      await connect();
      expect(pg.Pool.mock.results[0].value.connect).toHaveBeenCalled();
    });
  });

  describe('Test release', () => {
    it('should invoke release', () => {
      const { release } = require('../connection');

      const releaseFn = jest.fn();

      release({ release: releaseFn });
      expect(releaseFn).toHaveBeenCalled();
    });

    it('should do nothing', () => {
      const { release } = require('../connection');
      release();
      // Nothing to assert
      // This section is for code coverage
    });
  });
});
