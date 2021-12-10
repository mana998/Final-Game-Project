async function changeInteractions(category, id) {
  let interactions = [];
  //get all messages
  $(`.input-${category}`).map(function() {
    interactions.push($(this).val());
  })
  const response = await fetch('/api/interaction', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "player_id": id, "interaction_category": category, "interactions": interactions }),
  });
  const result = await response.json();
}

function addInteractionField(category, interaction) {
  return `<input type="text" class="form-control input-${category}" value='${interaction}'>`;
}

async function createInteractionsForm(id) {
  //load player interactions
  //need to get category id and interaction id
  //split into smaller forms based on sections
  //need to check more how data is passed though form
  let url = `api/interaction?player_id=${id}`;
  let response = await fetch(url);
  let result = await response.json();
  url = `api/interaction`;
  response = await fetch(url);
  if (result.message) delete result.message;
  let resultGeneral = await response.json();
  for (category in resultGeneral) {
    if (!result[category]) {
      result[category] = resultGeneral[category];
    }
  }
  for (category in result) {
    $('#interactionForm').append(`<form id="${category}Form">`);
    $(`#${category}Form`).append(`<h2>${category}</h2>`);
    result[category].map(interaction => {
      $(`#${category}Form`).append(addInteractionField(category, interaction));
    })
    $(`#${category}Form`).append(`<button type="button" id="submit${category}">Save</button>`);
    $(`#submit${category}`).attr('onclick', `changeInteractions("${category}", "${id}")`);
    $('#interactionForm').append(`</form>`);
  }
}

async function showInteractions(playerId) {
  $('#loginAndRegister').css('display', 'none');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#interactionForm').css('display', 'block');
  $('#interactionForm').empty();
  $('#gameScreen').css('display', 'none');
  $('#highscore').css('display', 'none');
  createInteractionsForm(playerId);
}

async function openInteractions() {
  const result = await getSession();
  if (result.username && result.playerId) {
    showInteractions(result.playerId);
    return;
  }
  alert(result.message);
  showInteractions(4);
}