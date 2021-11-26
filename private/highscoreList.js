const router = require('express').Router();
const db = require('../database/connection.js').connection;

router.get("/api/highscores/user/:userHighestScore", (req, res) => {

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
        LIMIT 5);`, [req.params["userHighestScore"],req.params["userHighestScore"]], (error, result, fields) => {
        if (result && result.length) {
            const highscores = [];
            for (const highscore of result) {
                highscores.push({place: highscore.high_score_id, username: highscore.username, score: highscore.score, dateTime: highscore.date_time});
            }
            res.send({
                highscores: highscores
            });
        } else {
            res.send({
                message: "No scores found"
            });
        }
    });
})

router.get("/api/highestscore/user/:userId", (req, res) => {
    db.query(`SELECT score FROM high_score WHERE player_id = ? ORDER BY score DESC LIMIT 1;`, [req.params["userId"]], (error, result, fields) => {
        if (result && result.length) {
            res.send({
                highestscore: result[0].score
            });
        } else {
            res.send({
                message: "No scores found."
            });
        }
    });
})

module.exports = {
    router,
};