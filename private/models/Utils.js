class Utils {

    //method for id generation
    makeId(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for ( var loopNumber = 0; loopNumber < length; loopNumber++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    //generate random whole number
    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}

if (typeof exports !== 'undefined'&& typeof module !== 'undefined' && module.exports) module.exports = {Utils};