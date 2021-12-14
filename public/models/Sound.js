const soundSrc = {
  coin : './assets/audio/soundfx/coin.wav',
  gem : './assets/audio/soundfx/gem.wav',
  hit : './assets/audio/soundfx/hit.wav',
  backgroundMusic: './assets/audio/music/backgroundMusic.mp3',
  walk: './assets/audio/soundfx/walk.wav',
  talk1: './assets/audio/soundfx/blabla1.mp3',
  talk2: './assets/audio/soundfx/blabla2.mp3',
}

//https://www.w3schools.com/graphics/game_sound.asp
class Sound {
    constructor (src, className) {
      if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
        this.sound = '';
      } else {
        this.className = className;
        this.sound = document.createElement("audio");
        this.sound.src = soundSrc[src];
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("class", this.className);
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
