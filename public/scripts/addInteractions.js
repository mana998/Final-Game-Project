/* eslint-disable no-unused-vars */
// Marianna

function addInteractionField(category, interaction) {
  return `<div class="longInput longButton backgroundPicture">
  <input type="text" class="inputButtonText brownText input-${category}" value='${interaction}' maxlenght='45'>
  </div>`;
}

async function createInteractionsForm(id) {
  $('#interactionForm').append('<h1 class="gameTitle">INTERACTIONS</h1>');
  $('#interactionForm').append('<div id="interactionForms">');
  // load player custom interactions
  let url = `api/interactions?player_id=${id}`;
  let response = await fetch(url);
  const result = await response.json();
  // deletes message bc we are looping through categories
  if (result.message) delete result.message;
  // load default interactions
  url = 'api/interactions';
  response = await fetch(url);
  const resultGeneral = await response.json();
  // compare player and default interactions if player is missing the category it's taken from default
  for (const category in resultGeneral) {
    if (!result[category]) {
      result[category] = resultGeneral[category];
    }
  }
  Object.keys(result).sort().map((category) => {
    $('#interactionForms').append(`<form id="${category}Form" class="interactionForm">`);
    $(`#${category}Form`).append(`<h2 class="categoryTitle">${category}</h2>`);
    result[category].map((interaction) => {
      $(`#${category}Form`).append(addInteractionField(category, interaction));
    });
    let buttons = '<div class="categoryButtons">';
    buttons += `<button type="button" id="submit${category}" class="submitButton backgroundPicture smallButton">
      <span class="buttonText orangeText">Save</span>
      </button>`;
    buttons += `<button type="button" id="reset${category}" class="resetButton backgroundPicture smallButton">
      <span class="buttonText orangeText">Reset</span>
      </button>`;
    buttons += '</div>';
    $(`#${category}Form`).append(buttons);
    $(`#submit${category}`).attr('onclick', `changeInteractions("${id}", "${category}")`);
    $(`#reset${category}`).attr('onclick', `resetInteractions("${id}", "${category}")`);
    $('#interactionForms').append('</form>');
  });
  $('#interactionForm').append(`<br><button type="button" id="resetAll" class="resetAllButton backgroundPicture smallButton">
    <span class="buttonText orangeText">Reset All</span>
    </button>`);
  $('#resetAll').attr('onclick', `resetInteractions("${id}")`);
  $('#interactionForm').append('</div>');
}

async function showInteractions(playerId) {
  $('#mainMenu').css('display', 'none');
  $('#interactionForm').css('display', 'block');
  $('#interactionForm').empty();
  $('#returnToMainMenuButton').css('display', 'block');
  $('#returnToMainMenuButton').addClass('interactionsReturnToMainButton');
  createInteractionsForm(playerId);
}

async function resetInteractions(id, category) {
  const response = await fetch('/api/interactions', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player_id: id, interaction_category: category }),
  });
  const result = await response.json();
  // reload the page
  if (result.message.match(/success/)) {
    showInteractions(id);
  }
}

async function changeInteractions(id, category) {
  const interactions = [];
  // get all messages
  $(`.input-${category}`).map(function () {
    interactions.push($(this).val());
  });
  const response = await fetch('/api/interactions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player_id: id, interaction_category: category, interactions }),
  });
  const result = await response.json();
  if (result.message !== 'Interactions added') {
    alert(result.message);
  }
}

async function openInteractions() {
  const result = await getSession();
  if (result.username && result.playerId) {
    showInteractions(result.playerId);
    return;
  }
  alert(result.message);
}
