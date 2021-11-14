//method for id generation
function createId(length) {
    var id = "";
    for ( var loopNumber = 0; loopNumber < length; loopNumber++ ) {
        id += String.fromCharCode(Math.floor(Math.random() * 75)+48);
    }
    return id;
}

module.exports = {
    createId,
}