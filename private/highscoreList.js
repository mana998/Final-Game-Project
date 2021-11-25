const router = require('express').Router();
const db = require('../database/connection.js').connection;

router.get("/api/highscores", (req, res) => {

    db.query(`(SELECT * FROM high_score WHERE score >=? ORDER BY score ASC LIMIT 5)
        UNION ALL
        (SELECT * FROM high_score WHERE score < ? ORDER BY score DESC LIMIT 5);`, [req.params["user_id"],req.params["recipe_id"] ], (error, result, fields) => {
        if (result && result.length) {

            res.send({
            });
        } else {
            res.send({
                message: "No scores found"
            });
        }
    });
})

router.get("/api/highestscore/user/:userId", (req, res) => {
    console.log(req.params["userId"]);
    db.query(`(SELECT score FROM high_score WHERE player_id = ? ORDER BY score DES LIMIT 1);`, [req.params["userId"]], (error, result, fields) => {
        if (result && result.length) {
            console.log(result);
            res.send({
                highestscore: 1
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