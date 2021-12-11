const router = require('express').Router();
const pool = require('../database/connection').pool;

// Marianna
router.get('/api/interactions', (req, res) => {
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

router.post('/api/interactions', (req, res) => {
  pool.getConnection(async function(err, db) {
    let interaction_category_id;
    //get category id
    let result = await getCategoryId(db, req.body.interaction_category)
    if (result && result.length === 1) {
      interaction_category_id = result[0].interaction_category_id;
      //delete messages
      let deleteReturn = await deleteInteraction(db, req.body.player_id, interaction_category_id);
        if (deleteReturn.result && !deleteReturn.error) {
          //insert messages
          let query = 'INSERT INTO interaction (interaction_message, interaction_category_id, player_id) VALUES (?, ?, ?)';
          let values = [req.body.interactions[0], interaction_category_id, req.body.player_id];
          for (let i = 1; i < req.body.interactions.length; i++) {
            query += ', (?, ?, ?)';
            values.push(req.body.interactions[i], interaction_category_id, req.body.player_id);
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
        } else {
          res.send({
            message: 'Something went wrong. Try again.'
          });
        }
    }
    db.release();
  });
});

router.delete('/api/interactions', (req, res) => {
  pool.getConnection(async function(err, db) {
    let interaction_category_id;
    let result;
    //get category id
    if (req.body.interaction_category) {
      result = await getCategoryId(db, req.body.interaction_category)
      if (result && result.length === 1) interaction_category_id = result[0].interaction_category_id;
    }
    if (interaction_category_id || !req.body.interaction_category) {
      //delete messages
      let deleteReturn = await deleteInteraction(db, req.body.player_id, interaction_category_id);
        if (deleteReturn.result && !deleteReturn.error) {
          res.send({
            message: 'Reset successful.'
          });
        } else {
          res.send({
            message: 'Something went wrong. Try again.'
          });
        }
    }
    db.release();
  });
});

async function deleteInteraction (db, player_id, category_id) {
    //delete messages
    let query = 'DELETE FROM interaction WHERE player_id = ?';
    let values = [player_id];
    if (category_id) {
      query += " && interaction_category_id = ?";
      values.push(category_id);
    }
    const returnObject = {};
    let result = await new Promise((resolve, reject) => db.query(query, values, (error, result, fields) => {
      if (error) {
        reject(error)
      } else {
        returnObject.error = error;
        returnObject.result = result;
        returnObject.fields = fields;
        resolve(returnObject)
      }
    }));
    return result;
};

async function getCategoryId(db, category) {
  let result = await new Promise((resolve, reject) => db.query('SELECT interaction_category_id FROM interaction_category WHERE interaction_category = ?', category, (error, result, fields) => {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  }))
  return result;
};

module.exports = {
  router,
};
