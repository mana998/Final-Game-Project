const soundSrc = {
  coin : './assets/audio/soundfx/coin.wav',
  gem : './assets/audio/soundfx/gem.wav',
  hit : './assets/audio/soundfx/hit.wav',
  backgroundMusic: './assets/audio/music/backgroundMusic.mp3'
}

//https://www.w3schools.com/graphics/game_sound.asp
class Sound {
    constructor (src) {
      if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
        this.sound = '';
      } else {
        this.sound = document.createElement("audio");
        this.sound.src = soundSrc[src];
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
      }
    }

    play() {
      this.sound.currentTime = 0;
      this.sound.play();
    }

    pause () {
      this.sound.pause();
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Sound };
