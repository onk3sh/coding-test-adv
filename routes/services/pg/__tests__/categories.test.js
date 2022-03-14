global.console.error = jest.fn(); // Mock console error
beforeEach(() => {
  jest.resetModules();
  jest.mock('../connection', () => ({
    connect: jest.fn(() => {
      return Promise.resolve({
        query: (statement, values) => {
          if (values) {
            if (values[0] === 'norow') {
              return {
                rows: []
              };
            } else if (values[0] === 'error') {
              return Promise.reject(new Error('Mock Insert Error'));
            } else if (values[0] === 'inserted') {
              return {
                rows: [{ id: '1', category: 'mock' }]
              };
            } else if (values[0] === 'removeOk') {
              return true; // Handles Delete
            } else {
              return Promise.reject(new Error('Mock Delete error'));
            }
          } else {
            // Assume it is select
            if (
              statement === 'BEGIN' ||
              statement === 'COMMIT' ||
              statement === 'ROLLBACK'
            ) {
              return true;
            } else {
              return {
                rows: [{ id: 1, category: 'mocked' }]
              };
            }
          }
        }
      });
    }),
    release: jest.fn()
  }));
});

describe('Test PG Categories', () => {
  describe('Test Select', () => {
    it('should select and return some result', async () => {
      const { get } = require('../categories');

      const result = await get();

      expect(result).toEqual([{ category: 'mocked', id: 1 }]);
    });

    it('should select and throw an error', async () => {
      const connection = require('../connection');
      jest.spyOn(connection, 'connect').mockResolvedValue({
        query: jest.fn((statement) => {
          return Promise.reject(new Error('Mock Error'));
        }),
        release: jest.fn()
      });
      const { get } = require('../categories');
      expect.assertions(1);
      try {
        await get();
      } catch (error) {
        expect(error.message).toEqual('Mock Error');
      }
    });
  });

  describe('Test Create ', () => {
    it('should create and return result', async () => {
      const { create } = require('../categories');
      const result = await create('inserted');
      expect(result).toEqual({ category: 'mock', id: '1' });
    });

    it('should throw error in Insert', async () => {
      const { create } = require('../categories');
      expect.assertions(1);
      try {
        await create('norow');
      } catch (error) {
        expect(error.message).toEqual('There is an error in the INSERT');
      }
    });

    it('should throw some random error', async () => {
      const { create } = require('../categories');
      expect.assertions(1);
      try {
        await create('error');
      } catch (error) {
        expect(error.message).toEqual('Mock Insert Error');
      }
    });
  });

  describe('Test Remove', () => {
    it('should remove successfully', async () => {
      const { remove } = require('../categories');
      expect.assertions(0);
      try {
        await remove('removeOk');
      } catch (error) {
        expect(error.message).toMatch('Mock Delete error');
      }
    });

    it('should throw an error when remove', async () => {
      const { remove } = require('../categories');
      expect.assertions(1);
      try {
        await remove('removeNOk');
      } catch (error) {
        expect(error.message).toMatch('Mock Delete error');
      }
    });
  });
});