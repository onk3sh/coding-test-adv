beforeAll(() => {
    jest.mock('../../services/auth', () => ({
      validateToken: (token) => {
        if (token === 'good') {
          return true;
        } else if (token === 'bad') {
          return false;
        } else {
          throw new Error('validateFail');
        }
      }
    }));
  });
  
  describe('Test Authenticate Middleware', () => {
    it('should authenticate and call next fn', () => {
      const req = {
        headers: {
          authorization: 'Bearer good'
        }
      };
  
      const sendStatusFn = jest.fn((status) => status);
      const res = {
        sendStatus: sendStatusFn
      };
  
      const nextFn = jest.fn();
  
      const authenticate = require('../authenticate');
      authenticate(req, res, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect(sendStatusFn).not.toHaveBeenCalled();
    });
  
    it('should fail to authenticate when no authorization header', () => {
      const req = {
        headers: {
          otherHeader: 'Bearer good'
        }
      };
  
      const sendStatusFn = jest.fn((status) => status);
      const res = {
        sendStatus: sendStatusFn
      };
  
      const nextFn = jest.fn();
  
      const authenticate = require('../authenticate');
      authenticate(req, res, nextFn);
      expect(nextFn).not.toHaveBeenCalled();
      expect(sendStatusFn).toHaveBeenCalledWith(401);
    });
  
    it('should fail to authenticate when validateToken fail', () => {
      const req = {
        headers: {
          authorization: 'Bearer bad'
        }
      };
  
      const sendStatusFn = jest.fn((status) => status);
      const res = {
        sendStatus: sendStatusFn
      };
  
      const nextFn = jest.fn();
  
      const authenticate = require('../authenticate');
      authenticate(req, res, nextFn);
      expect(nextFn).not.toHaveBeenCalled();
      expect(sendStatusFn).toHaveBeenCalledWith(401);
    });
  
    it('should return 401 when an error occured', () => {
      const req = {
        headers: {
          authorization: 'Bearer error'
        }
      };
  
      const sendStatusFn = jest.fn((status) => status);
      const res = {
        sendStatus: sendStatusFn
      };
  
      const nextFn = jest.fn();
  
      const authenticate = require('../authenticate');
      authenticate(req, res, nextFn);
      expect(nextFn).not.toHaveBeenCalled();
      expect(sendStatusFn).toHaveBeenCalledWith(401);
    });
  });