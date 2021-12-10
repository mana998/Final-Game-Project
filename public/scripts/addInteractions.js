function addInteractionField(category, interaction) {
  return `<input type="text" class="form-control" value='${interaction}'>`;
}

async function createInteractionsForm(id) {
  //load player interactions
  //need to get category id and interaction id
  //split into smaller forms based on sections
  //need to check more how data is passed though form
  let url = `api/interaction?player_id=${id}`;
  response = await fetch(url);
  result = await response.json();
  if (result.message) {
    url = `api/interaction`;
    response = await fetch(url);
    result = await response.json();
  }
  for (category in result) {
    $('#interactionForm').append(`<form id="${category}Form">`);
    $(`#${category}Form`).append(`<h2>${category}</h2>`);
    result[category].map(interaction => {
      $(`#${category}Form`).append(addInteractionField(category, interaction));
    })
    $(`#${category}Form`).append(`<input type="submit" value="Save">`);
    $('#interactionForm').append(`</form>`);
  }
}

async function showInteractions(playerId) {
  $('#loginAndRegister').css('display', 'none');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#interactionForm').css('display', 'block');
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
}