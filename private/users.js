const router = require('express').Router();
const bcrypt = require('bcrypt');
const { pool } = require('../database/connection');

// import utils class
const Utilities = require('../public/models/Utils').Utils;
// create utils object
const Utils = new Utilities();

// the cost factor that indicates the amount of time needed to calculate a single bcrypt hash.
// Higher the salt rounds, the more hashing rounds are done,
// hence the time and difficulty is increased while brute-forcing
const saltRounds = 15;

// Dagmara
// check if username and password exists in db and return player id if not return message
router.post('/api/users/login', (req, res) => {
  pool.getConnection((err, db) => {
    db.query('SELECT * FROM player WHERE username=?;', [req.body.username], (error, result, fields) => {
      if (result && result.length === 1) {
        bcrypt.compare(req.body.password, result[0].password, (error, match) => {
          if (match) {
            res.send({
              playerId: result[0].player_id,
              username: result[0].username,
            });
          } else {
            res.send({
              message: 'You have entered an invalid username or password.',
            });
          }
        });
      } else {
        res.send({
          message: 'You have entered an invalid username or password',
        });
      }
    });
    db.release();
  });
});

// Dagmara
// check if username and password are valid, check if username already exsts, add new player to db
router.post('/api/users/register', (req, res) => {
  pool.getConnection((err, db) => {
    const usernameValid = Utils.checkStringCharacters(req.body.username);
    const passwordValid = Utils.checkStringCharacters(req.body.password, 100);
    if (usernameValid && passwordValid) {
      db.query('SELECT * FROM player WHERE username=?;', [req.body.username], (error, result, fields) => {
        if (result && result.length === 1) {
          res.send({
            message: 'Username already exists. Try again.',
          });
        } else if (result.length === 0) {
          bcrypt.hash(req.body.password, saltRounds, (error, hashedPassword) => {
            if (!error) {
              db.query('INSERT INTO player (username, password) VALUES (?, ?);', [req.body.username, hashedPassword], (error, result, fields) => {
                if (result.affectedRows === 1) {
                  res.send({
                    message: 'User added successfully.',
                  });
                } else {
                  res.send({
                    message: 'Something went wrong. Try again.',
                  });
                }
              });
            } else {
              res.send({
                message: 'Something went wrong. Try again.',
              });
            }
          });
        } else {
          res.send({
            message: 'Something went wrong. Try again.',
          });
        }
      });
    } else {
      res.send({
        message: 'Please, enter correct amount of characters from: A-Z and 0-9.',
      });
    }
    db.release();
  });
});

module.exports = {
  router,
};
