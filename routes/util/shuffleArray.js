/**
 *
 * @param {Array.<any>} array
 */
const shuffleArray = (array) => {
  const returnArray = array;
  for (let i = returnArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = returnArray[i];
    returnArray[i] = returnArray[j];
    returnArray[j] = temp;
  }

  return returnArray;
};

module.exports = shuffleArray;
