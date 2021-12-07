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
  db.query('SELECT COUNT(high_score.high_score_id) AS scoresCount FROM high_score;',(error, result, fields) => {
    if (result && result.length) {
      const pageLimit = 10;
      const currentPage = req.params.currentPage;
      const scoresSize = result[0].scoresCount;
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

router.post('/api/highestscores', (req, res) => {
  db.query('SELECT COUNT(high_score.score) AS scoresCount FROM high_score;', (error, result, fields) => {
    console.log(error);
    console.log(result);
    if (result && result[0].scoresCount > 100) {
      console.log("if first");
      db.query('SELECT COUNT(high_score.score) AS highScoreCount FROM high_score WHERE high_score.score < ?;', [req.body.score], (error, result, fields) => {
        console.log(result[0].highScoreCount);
        if (result && !result[0].highScoreCount) {
          db.query('DELETE FROM high_score ORDER BY high_score.score ASC LIMIT 1',(error, result, fields) => {
            console.log(result);
            console.log("after delete before insert");
            if (result && result.affectedRows === 1) {
              insertScore(req, res);
              console.log("after insert");
            } else {
              res.send({
                message: 'Something went wrong, last lowest score is not deleted!',
              });
            }
          });
        } else {
          res.send({
            message: 'Your score is below 100 best scores.',
          });
        }
      });
    } else if (result && result[0].scoresCount < 100) {
      console.log("else if ");
      insertScore(req, res);
    } else {
      console.log("else")
      res.send({
        message: 'No scores found.',
      });
    }
  });        
});

function insertScore(req, res) {
  const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
      db.query('INSERT INTO high_score (player_id, score, date_time) VALUES (?, ?, ?);', [req.body.playerId, req.body.score, date_time], (error, result, fields) => {
        console.log(result);
        if (result && result.affectedRows === 1) {
          res.send({
            message: 'Your score is now in one of the best 100 in the game!',
            isSaved: true,
          });
        } else {
          res.send({
            message: 'Something went wrong, your score is not saved in database!',
          });
        }
      });
}


module.exports = {
  router,
};
