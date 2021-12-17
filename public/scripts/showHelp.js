function showHelpWindow() {
  $('#helpWindow').css('display', 'block');
  if ($('#helpWindow').is(':empty')) {
    showInitialWindow();
  }
}

function showInitialWindow() {
  $('#helpWindow').append(`<h1 id='helpHeader'>Placeholder</h1>`);
  $('#helpWindow').append(`<button id='closeHelp'>X</button>`);
  $('#helpWindow').append(`<div id='helpContent'>content</div>`);
  $('#helpWindow').append(`<button id='rightArrow'>-&gt;</button>`);
  $('#helpWindow').append(`<button id='leftArrow'>&lt;-</button>`);
}