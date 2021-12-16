function showHelpWindow() {
  $('#helpWindow').css('display', 'block');
  $('div').not('#helpWindow').css('filter', 'blur(0.1em)');
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
  $('div').not('#helpWindow').css('filter', 'blur(0em)');
}

function showBasicInfo() {
  console.log('showBasicInfo');
};

function showControls() {
  console.log('showControls');
};

function showCollectibles() {
  console.log('showCollectibles');
};

function showGemTypes() {
  console.log('showGemTypes');
};

function showTraps() {
  console.log('showTraps');
};