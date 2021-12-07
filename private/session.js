const router = require('express').Router();

//Dagmara
//return playerId from session
router.get('/getsession', (req, res) => {
  if (req.session.playerId && req.session.username) {
    res.send({
      playerId: req.session.playerId,
      username: req.session.username,
    });
    return;
  }
  res.send({
    message: "User not logged in.",
  });
  return;
  
});

//Dagmara
//sets session id with player id
router.post('/setsession', (req, res) => {
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
        isDestroyed: 0,
      });
    } else {
      res.send({
        message: 'Session destroyed',
        isDestroyed: 1,
      });
    }
  });
});

module.exports = {
  router,
};
