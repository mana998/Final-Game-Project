const router = require('express').Router();

//Dagmara
//return playerId from session
router.get('/getsession', (req, res) => {
  res.send({
    playerId: req.session.playerId,
    username: req.session.username,
  });
});

//Dagmara
//sets session id with player id
router.post('/setsession/player', (req, res) => {
  if (req.body.playerId && req.body.username) {
    req.session.playerId = req.body.playerId;
    req.session.username = req.body.username;
    res.send({ playerId: req.body.playerId, username: req.body.username, message: 'Session is set' });
  } else {
    res.send({ message: 'Session not set' });
  }
});

//Dagmara
//destroys session
router.delete('/destroysession', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.send({
        message: 'Something went wrong',
      });
    } else {
      res.send({
        message: 'Session destroyed',
      });
    }
  });
});

module.exports = {
  router,
};
