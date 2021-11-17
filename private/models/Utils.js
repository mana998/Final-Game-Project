class Utils {

    //Dagmara
    //method for id generation
    createId(length) {
        let id = "";
        for ( let i = 0; i < length; i++ ) {
            id += String.fromCharCode(Math.floor(Math.random() * 75)+48);
        }
        return id;
    }

    //Dagmara
    //check if string contains only : ; < = > A-Z and 0-9
    checkStringCharacters(word) {
        if (!word.length) {
            return false;
        }
        const allowedCharacters = 'ABCDEFGHIJKLMNOPRSTUVYX'
        const wordPassed = word.split("").every(character => 
            character.charCodeAt(0) >=48 && character.charCodeAt(0) <=57 || allowedCharacters.split("").includes(character.toUpperCase()));
        return wordPassed;
        
    }

    //Marianna
    //generate random whole number
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

if (typeof exports !== 'undefined'&& typeof module !== 'undefined' && module.exports) module.exports = {Utils};