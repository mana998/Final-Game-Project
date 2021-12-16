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
  console.log('showBasicInfo');
  $('#helpHeader').text("Basic Info");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showTraps()");
  $('#rightArrow').attr('onclick', "showControls()");
  $('#helpContent').append(`<h2 class='helpContentHeader'>Goal</h2>`);
  $('#helpContent').append(`<img id="chestImage" src="../assets/images/helpScreen/chest.png">`);
  $('#helpContent').append(`<p class='helpContentText'>goal of this game is to collect as many coins as possible
  and get to the goal as fast as possible. You will get
  additional score based on your time. Goal is represented
  as a chest of gold.</p>`);
  $('#helpContent').append(`<h2 class='helpContentHeader'>Health</h2>`);
  $('#helpContent').append(`<img id="healthImage" src="../assets/images/helpScreen/healthHelp.png">`);
  $('#helpContent').append(`<p class='helpContentText'>you need to be careful. There are multiple traps placed
  across the maze that will hurt you. You can see your
  remaining health in the top left corner.
  If your health reaches 0, you cannot continue the game</p>`);
};

function showControls() {
  console.log('showControls');
  $('#helpHeader').text("Controls");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showBasicInfo()");
  $('#rightArrow').attr('onclick', "showCollectibles()");
};

function showCollectibles() {
  console.log('showCollectibles');
  $('#helpHeader').text("Collectibles");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showControls()");
  $('#rightArrow').attr('onclick', "showGemTypes()");
};

function showGemTypes() {
  console.log('showGemTypes');
  $('#helpHeader').text("Gem Types");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showCollectibles()");
  $('#rightArrow').attr('onclick', "showTraps()");
};

function showTraps() {
  console.log('showTraps');
  $('#helpHeader').text("Traps");
  $('#helpContent').empty();
  $('#leftArrow').attr('onclick', "showGemTypes()");
  $('#rightArrow').attr('onclick', "showBasicInfo()");
};