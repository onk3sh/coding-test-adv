describe('Test Shuffle Array', () => {
    it('should return the array in a different order', () => {
      const shuffle = require('../shuffleArray');
  
      const result = shuffle([1, 2, 3, 4, 5]);
      expect(result).not.toEqual([1, 2, 3, 4, 5]);
    });
  });
  