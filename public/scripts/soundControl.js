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