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

    //Dagmara
    //check if string contains only : ; < = > A-Z and 0-9 and from 1 to 25/100 characters
    checkStringCharacters(word, amount=25) {
        const reg = new RegExp(`/^[a-zA-Z\d]{1,${amount}}$/`);
        return reg.test(word);
    }

    //Marianna
    //generate random whole number
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //Marianna
    //checks if two objects are intersecting
    checkCollision(obj1, obj2) {
      return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y)
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Utils };
