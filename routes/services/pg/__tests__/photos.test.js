global.console.error = jest.fn();
beforeEach(() => {
  jest.mock('pg-format', () =>
    jest.fn((query, value) => ({
      query,
      value
    }))
  );

  jest.mock('../connection', () => ({
    connect: jest.fn(() => {
      return Promise.resolve({
        query: (statement, value) => {
          if (typeof statement === 'object') {
            //Speak Query for pg-format
            if (statement.value[0][0] === 'norow') {
              return {
                rows: []
              };
            } else if (statement.value[0][0] === 'error') {
              return Promise.reject(new Error('Mock Insert Error'));
            } else {
              return {
                rows: [
                  {
                    id: 1,
                    category_id: 1,
                    photo_url: 'mockUrl'
                  }
                ]
              };
            }
          } else {
            if (value[0] === 'selecterror') {
              return Promise.reject(new Error('Mock Select Error'));
            } else if (value[0] === 'selectok') {
              return {
                rows: [
                  {
                    id: 1,
                    category_id: 1,
                    photo_url: 'mockSelectUrl'
                  }
                ]
              };
            } else if (value[0] === 'deleteerror') {
              return Promise.reject(new Error('Mock Delete Error'));
            } else {
              return true;
            }
          }
        }
      });
    }),
    release: jest.fn()
  }));
});

describe('Test PG Photos', () => {
  describe('Test Create', () => {
    it('should insert and return some result', async () => {
      const { create } = require('../photos');

      const newPhoto = [
        {
          categoryid: 1,
          photourl: 'someMockUrl'
        }
      ];

      const result = await create(newPhoto);
      expect(result).toEqual([{ category_id: 1, id: 1, photo_url: 'mockUrl' }]);
    });

    it('should throw error when insert result in no row', async () => {
      const { create } = require('../photos');

      const newPhoto = [
        {
          categoryid: 'norow',
          photourl: 'someMockUrl'
        }
      ];

      expect.assertions(1);
      try {
        await create(newPhoto);
      } catch (error) {
        expect(error.message).toMatch('There is an error in the INSERT');
      }
    });

    it('should throw an error', async () => {
      const { create } = require('../photos');

      const newPhoto = [
        {
          categoryid: 'error',
          photourl: 'someMockUrl'
        }
      ];

      expect.assertions(1);
      try {
        await create(newPhoto);
      } catch (error) {
        expect(error.message).toMatch('Mock Insert Error');
      }
    });
  });

  describe('Test Get', () => {
    it('should get some result', async () => {
      const { get } = require('../photos');

      const result = await get(['selectok']);
      expect(result).toEqual([
        { category_id: 1, id: 1, photo_url: 'mockSelectUrl' }
      ]);
    });

    it('should return some error', async () => {
      const { get } = require('../photos');

      expect.assertions(1);
      try {
        await get(['selecterror']);
      } catch (error) {
        expect(error.message).toMatch('Mock Select Error');
      }
    });
  });

  describe('Test Remove', () => {
    it('shold delete without problem', async () => {
      const { remove } = require('../photos');

      expect.assertions(0);
      try {
        await remove(['ok']);
      } catch (error) {
        expect(error.message).toMatch('Mock Delete Error');
      }
    });

    it('should delete with an error', async () => {
      const { remove } = require('../photos');

      expect.assertions(1);
      try {
        await remove(['deleteerror']);
      } catch (error) {
        expect(error.message).toMatch('Mock Delete Error');
      }
    });
  });
});