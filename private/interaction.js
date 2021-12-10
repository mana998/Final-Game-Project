const router = require('express').Router();
const pool = require('../database/connection').pool;

// Marianna
router.get('/api/interaction', (req, res) => {
  pool.getConnection(function(err, db) {
    let interactions = {};
    //get messages
    let query = 'SELECT interaction_message, interaction_category FROM interaction  JOIN interaction_category ON interaction.interaction_category_id = interaction_category.interaction_category_id WHERE player_id ';
    query += req.query.player_id ? '= ?' : 'IS NULL'
    db.query(query, [req.query.player_id], (error, result, fields) => {
      if (result && result.length) {
        for (const interaction of result) {
          if (!interactions[interaction.interaction_category]) {
            interactions[interaction.interaction_category] = [];
          }
          interactions[interaction.interaction_category].push(interaction.interaction_message);
        }
        res.send(interactions);
      } else {
        res.send({
          message: 'No results'
        });
      }
    });
    db.release();
  });
});

router.post('/api/interaction', (req, res) => {
  pool.getConnection(function(err, db) {
    //get messages
    let query = 'INSERT interaction_message, interaction_category_id, player_id INTO interaction VALUES (?, ?, ?)';
    let values = [req.query.interactions[0], req.query.interaction_category_id, req.query.player_id];
    for (let i = 1; i < req.body.interactions.length; i++) {
      query += ', VALUES (?, ?, ?)';
      values.push(interactions[i], req.body.interaction_category_id, req.body.player_id);
    }
    db.query(query, values, (error, result, fields) => {
      if (result && result.affectedRows) {
        res.send({
          message: "Interactions added"
        });
      } else {
        res.send({
          message: 'Something went wrong. Try again.'
        });
      }
    });
    db.release();
  });
});

module.exports = {
  router,
};
