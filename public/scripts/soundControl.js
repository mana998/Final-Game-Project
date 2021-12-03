const backgroundMusic = new Sound('backgroundMusic', 'bgMusic');
backgroundMusic.sound.setAttribute("loop", "true");

function toggleBackgroundMusic() {
  if (backgroundMusic.sound.paused) {
    backgroundMusic.play();
    $('#backgroundMusicControl').css('background-image', "url('../assets/images/buttons/musicOn.svg')");
  } else {
    backgroundMusic.pause();
    $('#backgroundMusicControl').css('background-image', "url('../assets/images/buttons/musicOff.svg')");
  }
}

function toggleSoundFx() {
  if ($('.soundfx').first().prop('volume') === 0) {
    $('.soundfx').prop('volume', 0.2);
    $('#soundFxControl').css('background-image', "url('../assets/images/buttons/soundFxOn.svg')");
  } else {
    $('.soundfx').prop('volume', 0);
    $('#soundFxControl').css('background-image', "url('../assets/images/buttons/soundFxOff.svg')");
  }
}