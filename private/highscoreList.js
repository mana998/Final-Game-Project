const router = require('express').Router();
const db = require('../database/connection.js').connection;

router.get('/api/highscores/user/:userHighestScore', (req, res) => {
  db.query(`(SELECT high_score.high_score_id, player.username, high_score.score, high_score.date_time 
        FROM player JOIN high_score 
        ON player.player_id = high_score.player_id 
        WHERE score >= ?
        ORDER BY score ASC
        LIMIT 5)
    
    UNION ALL
    
    (SELECT high_score.high_score_id, player.username, high_score.score, high_score.date_time 
        FROM player JOIN high_score 
        ON player.player_id = high_score.player_id
        WHERE score < ?
        ORDER BY score DESC
        LIMIT 5);`, [req.params.userHighestScore, req.params.userHighestScore], (error, result, fields) => {
    if (result && result.length) {
      const highscores = [];
      for (const highscore of result) {
        highscores.push({
          place: highscore.high_score_id, username: highscore.username, score: highscore.score, dateTime: highscore.date_time,
        });
      }
      res.send({
        highscores,
      });
    } else {
      res.send({
        message: 'No scores found',
      });
    }
  });
});

router.get('/api/highestscore/user/:userId', (req, res) => {
  db.query('SELECT score FROM high_score WHERE player_id = ? ORDER BY score DESC LIMIT 1;', [req.params.userId], (error, result, fields) => {
    if (result && result.length) {
      res.send({
        highestscore: result[0].score,
      });
    } else {
      res.send({
        message: 'No scores found.',
      });
    }
  });
});

router.get('/api/highestscores/:currentPage', (req, res) => {
  db.query('SELECT * FROM high_score;',(error, result, fields) => {
    if (result && result.length) {
      const pageLimit = 10;
      const currentPage = req.params.currentPage;
      const scoresSize = result.length;
      const offset = (currentPage - 1) *pageLimit; //minus one because offset defines from which row we want to retrieve data
      const fullPages = parseInt(scoresSize/pageLimit);
      const reminderOfScores = scoresSize % pageLimit === 0 ? 0 : 1;
      const pages = fullPages + reminderOfScores;
      db.query(`SELECT high_score.high_score_id, player.username, high_score.score, high_score.date_time 
      FROM player 
      JOIN high_score
      ON player.player_id = high_score.player_id
      ORDER BY high_score.score DESC
      LIMIT ?
      OFFSET ?;`, [pageLimit,offset], (error, result, fields) => {
        if (result && result.length) {
          const highscores = [];
          let index = (currentPage - 1) * pageLimit + 1.
          for (const highscore of result) {
            //date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
            highscores.push({
              place: index, username: highscore.username, score: highscore.score, dateTime: highscore.date_time.toISOString().slice(0, 19).replace('T', ' '),
            });
            index++;
          }
          res.send({
            highscores,
            pages,
          });
        } else {
          res.send({
            message: 'No scores found',
          });
        }
      });
    } else {
      res.send({
        message: 'No scores found.',
      });
    }
  });
});

module.exports = {
  router,
};