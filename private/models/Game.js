class Game {
  constructor() {
    this.players = [];
    this.map = {};
    this.playing = false;
    this.interactions = {
      greeting: ['hello there', 'hi', 'long time no see'],
      goodbye: ['bye bye', 'see you later'],
      confident: ['I will win', 'I can see the exit']
    }
  }
}

module.exports = {
  Game,
};
