function showHelpWindow() {
  $('#helpWindow').css('display', 'block');
  $('.container-fluid').css('filter', 'blur(0.5em)');
  $('.container-fluid').css('transform', 'scale(1.1)');
  //$('div').not('#helpWindow').css('filter', 'blur(0.2em)');
  if ($('#helpWindow').is(':empty')) {
    showInitialWindow();
  }
  showBasicInfo();
}

function showInitialWindow() {
  $('#helpWindow').append(`<h1 id='helpHeader'>Placeholder</h1>`);
  $('#helpWindow').append(`<button id='closeHelp'>X</button>`);
  $('#helpWindow').append(`<div id='helpContent'>content</div>`);
  $('#helpWindow').append(`<button id='rightArrow'>-&gt;</button>`);
  $('#helpWindow').append(`<button id='leftArrow'>&lt;-</button>`);
  $('#closeHelp').on('click', closeHelpWindow);
}

function closeHelpWindow() {
  //empty content
  $('#helpContent').empty();
  //close window
  $('#helpWindow').css('display', 'none');
  $('.container-fluid').css('filter', 'blur(0em)');
  $('.container-fluid').css('transform', 'scale(1)');
}

function showBasicInfo() {
  $('#helpHeader').text("Basic Info");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showTraps()");
  $('#rightArrow').attr('onclick', "showControls()");
  $('#helpContent').append(`<h2 class='helpContentHeader'>Goal</h2>`);
  $('#helpContent').append(`<img class="helpImage" id="chestImage" src="../assets/images/helpScreen/chest.png">`);
  $('#helpContent').append(`<p class='helpContentText'>goal of this game is to collect as many coins as possible
  and get to the goal as fast as possible. You will get
  additional score based on your time. Goal is represented
  as a chest of gold.</p>`);
  $('#helpContent').append(`<h2 class='helpContentHeader'>Health</h2>`);
  $('#helpContent').append(`<img class="helpImage" id="healthImage" src="../assets/images/helpScreen/healthHelp.png">`);
  $('#helpContent').append(`<p class='helpContentText'>you need to be careful. There are multiple traps placed
  across the maze that will hurt you. You can see your
  remaining health in the top left corner.
  If your health reaches 0, you cannot continue the game</p>`);
};

function showControls() {
  $('#helpHeader').text("Controls");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showBasicInfo()");
  $('#rightArrow').attr('onclick', "showCollectibles()");
  $('#helpContent').append(`<div id="movementExplanationAll"><div id="movementExplanationText"><h2 class='helpContentHeader' id="movementExplanationHeader">Movement</h2>
  <p class='helpContentText' id="movementExplanation">you can choose between using
  arrows or WASD</p></div>
  <img class="helpImage" id="wasdMovementImage" src="../assets/images/helpScreen/controlsWASD.png">
  <img class="helpImage" id="arrowsMovementImage" src="../assets/images/helpScreen/controlsArrows.png"></div>`);
  $('#helpContent').append(`<h2 class='helpContentHeader'>Player Interaction</h2>`);
  $('#helpContent').append(`<img class="helpImage" id="interactionImage" src="../assets/images/helpScreen/interactionButton.png">`);
  $('#helpContent').append(`<p class='helpContentText'>when you are close to another player, this small
  icon will pop up. By pressing enter and clicking on one
  of the categories, you can answer them.</p>`);
  $('#helpContent').append(`<h2 class='helpContentHeader'>Sound</h2>`);
  $('#helpContent').append(`<img class="helpImage" id="soundImage" src="../assets/images/helpScreen/soundHelp.png">`);
  $('#helpContent').append(`<p class='helpContentText'>To disable music or sound effects, click on these icons
  in top right corner.</p>`);
};

function showCollectibles() {
  $('#helpHeader').text("Collectibles");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showControls()");
  $('#rightArrow').attr('onclick', "showGemTypes()");
  $('#helpContent').append(`<p class='helpContentText'>in this game, there are multiple collectibles. you collect
  them by going through them.</p>`);
  $('#helpContent').append(`<div class="collectiblesExplanationAll"><div class="collectiblesExplanationText"><h2 class='helpContentHeader' id="coinsHeader">Coins</h2>
  <p class='helpContentText' id="movementExplanation">Each coin will add certain amount to your score. 
  Collect as many as you can to be in top 100.</p></div>
  <img class="helpImage" id="coinImage" src="../assets/images/helpScreen/coin.png">
  </div>`);
  $('#helpContent').append(`<div class="collectiblesExplanationAll"><div class="collectiblesExplanationText"><h2 class='helpContentHeader' id="gemsHeader">Gems</h2>
  <p class='helpContentText' id="movementExplanation">Each gem has 50/50 chance to either affect you 
  or all other players. You can encounter
  different types of gems, but you won't know 
  the type until you collect them.
  </p></div>
  <img class="helpImage" id="gemImage" src="../assets/images/helpScreen/gem.png">
  </div>`);
};

function showGemTypes() {
  $('#helpHeader').text("Gem Types");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showCollectibles()");
  $('#rightArrow').attr('onclick', "showTraps()");
  let block = `<div class="gridContainer">`;
  block += `<h2 class='helpContentHeader gridItem'>Freeze</h2>`;
  block += `<h2 class='helpContentHeader  gridItem'>Double score</h2>`;
  block += `<p class='helpContentText gridItem'>block your movement
  for certain amount of time</p>`;
  block += `<p class='helpContentText gridItem'>double your score
  (really powerful)</p>`;
  block += `<h2 class='helpContentHeader gridItem'>Reverse Movement</h2>`;
  block += `<h2 class='helpContentHeader gridItem'>Heal</h2>`;
  block += `<p class='helpContentText gridItem'>reverse your movement keys
  for certain amount of time</p>`;
  block += `<p class='helpContentText gridItem'>increase your health
  by certain amount</p>`;
  block += `<h2 class='helpContentHeader gridItem'>Teleport</h2>`;
  block += `<h2 class='helpContentHeader gridItem'>Speed Change</h2>`;
  block += `<p class='helpContentText gridItem'>teleport you to random
  location on the map</p>`;
  block += `<p class='helpContentText gridItem'>increase or decrease your
  speed for certain amount of time</p></div>`;
  $('#helpContent').append(block);
};

function showTraps() {
  $('#helpHeader').text("Traps");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showGemTypes()");
  $('#rightArrow').attr('onclick', "showBasicInfo()");
  let traps = `<h2 class='helpContentHeader'>Moving Traps</h2>`;
  traps += `<img class="helpImage" id="movingTrapImage" src="../assets/images/helpScreen/movingTrap.png">`;
  traps += `<p class='helpContentText'>These traps are moving at set speed Across set tiles. 
  Look closely and time your next move to avoid them.</p>`;
  traps += `<h2 class='helpContentHeader'>On and Off Traps</h2>`;
  traps += `<p class='helpContentText'>These traps have 2 states. On and OFF. They will hurt you
  only when they are in their On state. Observer them and
  wait for the opportunity to run across them.</p>`;
  traps += `<div class="gridContainer">`;
    traps += `<h2 class='helpContentHeader gridItem onOffHeader'>On</h2>`;
    traps += `<h2 class='helpContentHeader gridItem onOffHeader'>Off</h2>`;
    traps += `<div id="onPictures" class="gridItem trapImages">`;
      traps += `<img class="helpImage trapImage" src="../assets/images/helpScreen/onTrap.png">`;
      traps += `</div>`;
    traps += `<div id="offPictures" class="gridItem trapImages">`;
      traps += `<img class="helpImage trapImage" src="../assets/images/helpScreen/offTrap.png">`;
      traps += `</div>`;
  traps += `</div>`;
  $('#helpContent').append(traps);
};