// Marianna & Dagmara
const router = require('express').Router();
const { pool } = require('../database/connection.js');

router.get('/api/highestscores/:currentPage', (req, res) => {
  pool.getConnection((err, db) => {
    db.query('SELECT COUNT(high_score.high_score_id) AS scoresCount FROM high_score;', (error, result, fields) => {
      if (result && result.length) {
        const pageLimit = 10;
        const scoresSize = result[0].scoresCount;
        // minus one because offset defines from which row we want to retrieve data
        const offset = (req.params.currentPage - 1) * pageLimit;
        const pages = Math.ceil(scoresSize / pageLimit);
        db.query(`SELECT high_score.high_score_id, player.username, high_score.score, high_score.date_time 
        FROM player 
        JOIN high_score
        ON player.player_id = high_score.player_id
        ORDER BY high_score.score DESC
        LIMIT ?
        OFFSET ?;`, [pageLimit, offset], (error, result, fields) => {
          if (result && result.length) {
            const highscores = [];
            // calculate which posisition player have on the list
            let index = offset + 1.0;
            for (const highscore of result) {
              highscores.push({
                place: index, username: highscore.username, score: highscore.score,
                dateTime: highscore.date_time.toISOString().slice(0, 19).replace('T', ' '),
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
    db.release();
  });
});

router.post('/api/highestscores', (req, res) => {
  pool.getConnection((err, db) => {
    db.query('SELECT COUNT(high_score.score) AS scoresCount FROM high_score;', (error, result, fields) => {
      if (result && result[0].scoresCount >= 100) {
        db.query('SELECT COUNT(high_score.score) AS highScoreCount FROM high_score WHERE high_score.score < ?;', 
          [req.body.score], (error, result, fields) => {
          if (result && result[0].highScoreCount) {
            db.query('DELETE FROM high_score ORDER BY high_score.score ASC LIMIT 1', (error, result, fields) => {
              if (result && result.affectedRows === 1) {
                insertScore(req, res);
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
        insertScore(req, res);
      } else {
        res.send({
          message: 'No scores found.',
        });
      }
    });
    db.release();
  });
});

function insertScore(req, res) {
  pool.getConnection((err, db) => {
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query('INSERT INTO high_score (player_id, score, date_time) VALUES (?, ?, ?);', 
      [req.body.playerId, req.body.score, date_time], (error, result, fields) => {
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
    db.release();
  });
}

module.exports = {
  router,
};
