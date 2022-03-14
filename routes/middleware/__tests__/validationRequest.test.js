beforeAll(() => {
    jest.mock('express-validator', () => ({
      validationResult: jest.fn((req) => {
        if (req.body.msg === 'error') {
          return {
            array: jest.fn(() => ['some', 'mock', 'error'])
          };
        } else {
          return {
            array: jest.fn(() => [])
          };
        }
      })
    }));
  });
  
  describe('Test validateRequest middleware', () => {
    it('should call next when there is no error', () => {
      const req = {
        body: {
          msg: 'good'
        }
      };
  
      const jsonFn = jest.fn((errors) => errors);
      const statusFn = jest.fn((status) => ({
        json: jsonFn
      }));
  
      const res = {
        status: statusFn
      };
  
      const nextFn = jest.fn();
  
      const validateReq = require('../validationRequest');
      validateReq(req, res, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect(statusFn).not.toHaveBeenCalled();
    });
  
    it('should return 400 with the errors', () => {
      const req = {
        body: {
          msg: 'error'
        }
      };
  
      const jsonFn = jest.fn((errors) => errors);
      const statusFn = jest.fn((status) => ({
        json: jsonFn
      }));
  
      const res = {
        status: statusFn
      };
  
      const nextFn = jest.fn();
  
      const validateReq = require('../validationRequest');
      validateReq(req, res, nextFn);
      expect(nextFn).not.toHaveBeenCalled();
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({ errors: ['some', 'mock', 'error'] });
    });
  });