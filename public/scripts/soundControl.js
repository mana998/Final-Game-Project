/* eslint-disable no-unused-vars, no-undef */
const backgroundMusic = new Sound('backgroundMusic', 'bgMusic');
backgroundMusic.sound.setAttribute('loop', 'true');

function startBackgroundMusic() {
  backgroundMusic.play();
  $('#backgroundMusicControl').css('background-image', "url('../assets/images/buttons/musicOn.svg')");
}

function pauseBackgroundMusic() {
  backgroundMusic.pause();
  $('#backgroundMusicControl').css('background-image', "url('../assets/images/buttons/musicOff.svg')");
}

function pauseSoundFx() {
  $('.soundfx').prop('volume', 0);
  $('#soundFxControl').css('background-image', "url('../assets/images/buttons/soundFxOff.svg')");
}

function startSoundFx() {
  $('.soundfx').prop('volume', 0.2);
  $('#soundFxControl').css('background-image', "url('../assets/images/buttons/soundFxOn.svg')");
}

function toggleBackgroundMusic() {
  if (backgroundMusic.sound.paused) {
    startBackgroundMusic();
  } else {
    pauseBackgroundMusic();
  }
}

function toggleSoundFx() {
  if ($('.soundfx').first().prop('volume') === 0) {
    startSoundFx();
  } else {
    pauseSoundFx();
  }
}
