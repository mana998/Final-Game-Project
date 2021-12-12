//Dagmara
const numberOfCharacters = 8;
let selectedCharacter;

function generateCharacterSelection() {
    $('#characters').append(
        `<p>Select your character:</p>
         <div class="row" id ='charactersContainer' style="list-style-type:none">`);
    let characterNumber;
    
    for (characterNumber = 0; characterNumber < numberOfCharacters; characterNumber++) {
        $('#charactersContainer').append(
        `
            <div class="characterItem col-3">
                <input type="radio" id="character-${characterNumber}" class="characterInput" name="character-${characterNumber}" value="${characterNumber}">
                <label id ="characterLabel-${characterNumber}" for="character-${characterNumber}"  class="characterLabel"></label>
            </div>
        `)
        if (characterNumber > 3) {
            $(`#characterLabel-${characterNumber}`).css("background-position", `left ${-32 - (characterNumber * 3 * 32)}px top ${-32 * 4}px`);
        } else {
            $(`#characterLabel-${characterNumber}`).css("background-position", `left ${-32 - (characterNumber * 3 * 32)}px top 0px`);
        }

        $(`#characterLabel-${characterNumber}`).attr("onclick", `selectCharacter(${characterNumber})`);

    }
    
    $('#characters').append(`</div>`);
}

function selectCharacter (characterNumber) {
    $(`#charactersContainer`).find("label").addClass('disabled');
    $(`#characterLabel-${characterNumber}`).removeClass('disabled');
    selectedCharacter = characterNumber;
}