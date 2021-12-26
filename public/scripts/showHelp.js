/* eslint-disable no-unused-vars, no-undef */
function addPageNumber(number) {
  return `<p class="helpPageNumber">${number}/5</p>`;
}

function closeHelpWindow() {
  // empty content
  $('#contentText').empty();
  // close window
  $('#helpWindow').css('display', 'none');
  $('.container-fluid').css('filter', 'blur(0em)');
  $('.container-fluid').css('transform', 'scale(1)');
}

function showInitialWindow() {
  let content = '<h1 id=\'helpHeader\'></h1>';
  content += '<div id=\'helpContent\' class="backgroundPicture bigTable">';
  content += '<button id=\'closeHelp\' class="backgroundPicture squareButton"><span class="buttonText grayText">X</span></button>';
  content += '<div id="contentText"></div>';
  content += '</div>';
  content += '<button id=\'rightArrow\' class="backgroundPicture squareButton"><span class="buttonText orangeText">-&gt;</span></button>';
  content += '<button id=\'leftArrow\' class="backgroundPicture squareButton"><span class="buttonText orangeText">&lt;-</span></button>';

  $('#helpWindow').append(content);
  $('#closeHelp').on('click', closeHelpWindow);
}

function showBasicInfo() {
  $('#helpHeader').text('Basic Info');
  $('#contentText').empty();
  $('#leftArrow').attr('onclick', 'showTraps()');
  $('#rightArrow').attr('onclick', 'showControls()');
  $('#contentText').append('<h2 class=\'helpContentHeader\'>Goal</h2>');
  $('#contentText').append('<img class="helpImage" id="chestImage" src="../assets/images/helpScreen/chest.png">');
  $('#contentText').append(`<p class='helpContentText'>goal of this game is to collect as many coins as possible
  and get to the goal as fast as possible. You will get
  additional score based on your time. Goal is represented
  as a chest of gold.</p>`);
  $('#contentText').append('<h2 class=\'helpContentHeader\'>Health</h2>');
  $('#contentText').append('<img class="helpImage" id="healthImage" src="../assets/images/helpScreen/healthHelp.png">');
  $('#contentText').append(`<p class='helpContentText'>you need to be careful. There are multiple traps placed
  across the maze that will hurt you. You can see your
  remaining health in the top left corner.
  If your health reaches 0, you cannot continue the game</p>`);
  $('#contentText').append(addPageNumber(1));
}

function showControls() {
  $('#helpHeader').text('Controls');
  $('#contentText').empty();
  $('#leftArrow').attr('onclick', 'showBasicInfo()');
  $('#rightArrow').attr('onclick', 'showCollectibles()');
  $('#contentText').append(`<div id="movementExplanationAll">
    <div id="movementExplanationText">
      <h2 class='helpContentHeader' id="movementExplanationHeader">Movement</h2>
      <p class='helpContentText' id="movementExplanation">you can choose between using
  arrows or WASD</p>
    </div>
    <img class="helpImage" id="wasdMovementImage" src="../assets/images/helpScreen/controlsWASD.png">
    <img class="helpImage" id="arrowsMovementImage" src="../assets/images/helpScreen/controlsArrows.png"></div>`);
  $('#contentText').append('<h2 class=\'helpContentHeader\'>Player Interaction</h2>');
  $('#contentText').append('<img class="helpImage" id="interactionImage" src="../assets/images/helpScreen/interactionButton.png">');
  $('#contentText').append(`<p class='helpContentText'>when you are close to another player, this small
  icon will pop up. By pressing enter and clicking on one
  of the categories, you can answer them.</p>`);
  $('#contentText').append('<h2 class=\'helpContentHeader\'>Sound</h2>');
  $('#contentText').append('<img class="helpImage" id="soundImage" src="../assets/images/helpScreen/soundHelp.png">');
  $('#contentText').append(`<p class='helpContentText'>To disable music or sound effects, click on these icons
  in top right corner.</p>`);
  $('#contentText').append(addPageNumber(2));
}

function showCollectibles() {
  $('#helpHeader').text('Collectibles');
  $('#contentText').empty();
  $('#leftArrow').attr('onclick', 'showControls()');
  $('#rightArrow').attr('onclick', 'showGemTypes()');
  $('#contentText').append(`<p class='helpContentText'>in this game, there are multiple collectibles. you collect
  them by going through them.</p>`);
  $('#contentText').append(`<div class="collectiblesExplanationAll">
    <div class="collectiblesExplanationText">
      <h2 class='helpContentHeader' id="coinsHeader">Coins</h2>
      <p class='helpContentText' id="movementExplanation">Each coin will add certain amount to your score. 
      Collect as many as you can to be in top 100.</p>
    </div>
    <img class="helpImage" id="coinImage" src="../assets/images/helpScreen/coin.png">
  </div>`);
  $('#contentText').append(`<div class="collectiblesExplanationAll">
    <div class="collectiblesExplanationText">
      <h2 class='helpContentHeader' id="gemsHeader">Gems</h2>
      <p class='helpContentText' id="movementExplanation">Each gem has 50/50 chance to either affect you 
      or all other players. You can encounter
      different types of gems, but you won't know 
      the type until you collect them.
      </p>
    </div>
    <img class="helpImage" id="gemImage" src="../assets/images/helpScreen/gem.png">
  </div>`);
  $('#contentText').append(addPageNumber(3));
}

function showGemTypes() {
  $('#helpHeader').text('Gem Types');
  $('#contentText').empty();
  $('#leftArrow').attr('onclick', 'showCollectibles()');
  $('#rightArrow').attr('onclick', 'showTraps()');
  let block = '<div class="gridContainer">';
  block += '<h2 class=\'helpContentHeader gridItem\'>Freeze</h2>';
  block += '<h2 class=\'helpContentHeader  gridItem\'>Double score</h2>';
  block += `<p class='helpContentText gridItem'>block your movement
  for certain amount of time</p>`;
  block += `<p class='helpContentText gridItem'>double your score
  (really powerful)</p>`;
  block += '<h2 class=\'helpContentHeader gridItem\'>Reverse Movement</h2>';
  block += '<h2 class=\'helpContentHeader gridItem\'>Heal</h2>';
  block += `<p class='helpContentText gridItem'>reverse your movement keys
  for certain amount of time</p>`;
  block += `<p class='helpContentText gridItem'>increase your health
  by certain amount</p>`;
  block += '<h2 class=\'helpContentHeader gridItem\'>Teleport</h2>';
  block += '<h2 class=\'helpContentHeader gridItem\'>Speed Change</h2>';
  block += `<p class='helpContentText gridItem'>teleport you to random
  location on the map</p>`;
  block += `<p class='helpContentText gridItem'>increase or decrease your
  speed for certain amount of time</p></div>`;
  $('#contentText').append(block);
  $('#contentText').append(addPageNumber(4));
}

function showTraps() {
  $('#helpHeader').text('Traps');
  $('#contentText').empty();
  $('#leftArrow').attr('onclick', 'showGemTypes()');
  $('#rightArrow').attr('onclick', 'showBasicInfo()');
  let traps = '<h2 class=\'helpContentHeader\'>Moving Traps</h2>';
  traps += '<img class="helpImage" id="movingTrapImage" src="../assets/images/helpScreen/movingTrap.png">';
  traps += `<p class='helpContentText'>These traps are moving at set speed Across set tiles. 
  Look closely and time your next move to avoid them.</p>`;
  traps += '<h2 class=\'helpContentHeader\'>On and Off Traps</h2>';
  traps += `<p class='helpContentText'>There are 2 trap states (On, OFF). These traps hurt you
  only in their "On" state. Observe them and
  wait for the opportunity to pass them.</p>`;
  traps += '<div class="gridContainer">';
  traps += '<h2 class=\'helpContentHeader gridItem onOffHeader\'>On</h2>';
  traps += '<h2 class=\'helpContentHeader gridItem onOffHeader\'>Off</h2>';
  traps += '<div id="onPictures" class="gridItem trapImages">';
  traps += '<img class="helpImage trapImage" src="../assets/images/helpScreen/onTrap.png">';
  traps += '</div>';
  traps += '<div id="offPictures" class="gridItem trapImages">';
  traps += '<img class="helpImage trapImage" src="../assets/images/helpScreen/offTrap.png">';
  traps += '</div>';
  traps += '</div>';
  $('#contentText').append(traps);
  $('#contentText').append(addPageNumber(5));
}

// Marianna
function showHelpWindow() {
  $('#helpWindow').css('display', 'block');
  $('.container-fluid').css('filter', 'blur(0.5em)');
  $('.container-fluid').css('transform', 'scale(1.5)');
  if ($('#helpWindow').is(':empty')) {
    showInitialWindow();
  }
  showBasicInfo();
}
