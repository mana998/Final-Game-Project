class Utils {
  // Dagmara
  // method for id generation
  createId(length) {
    let id = '';
    for (let i = 0; i < length; i += 1) {
      id += String.fromCharCode(Math.floor(Math.random() * 75) + 48);
    }
    return id;
  }

  // Marianna
  // generate random whole number
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Utils };
