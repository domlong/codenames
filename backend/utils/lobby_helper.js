const shuffleArray = (array)  => {
    const shuffledArray = array.slice()
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const generateUniqueNumbers = (max) => {
    const chosenNumbers = new Set();
    return () => {
      if (chosenNumbers.size === max) {
        throw new Error('No more uniques!');
      }
      let num;
      do {
        num = Math.floor(Math.random() * max)
      } while (chosenNumbers.has(num));
      chosenNumbers.add(num);
      return num;
    };
}

const Teams = {
    NEUTRAL: 0,
    RED: 1,
    BLUE: 2,
    BLACK: 3
};

module.exports = {
    shuffleArray,
    generateUniqueNumbers,
    Teams,
}