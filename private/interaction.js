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
        res.send(
          'error'
        );
      }
    });
    db.release();
  });
});

module.exports = {
  router,
};
