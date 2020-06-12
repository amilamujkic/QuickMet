const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');


router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(EmailAddress) = LOWER(${db.escape(
      req.body.EmailAddress
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This email address is already in use!'
        });
      } else {
        bcrypt.hash(req.body.Password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            db.query(
              `INSERT INTO users (id, FirstName, Surname, EmailAddress, Password) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.EmailAddress
              )}, ${db.escape(hash)}, now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'Registered!'
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE EmailAddress = ${db.escape(req.body.EmailAddress)};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!'
        });
      }
      bcrypt.compare(
        req.body.Password,
        result[0]['Password'],
        (bErr, bResult) => {
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                EmailAddress: result[0].EmailAddress,
                UserId: result[0].UserId
              },
              'SECRETKEY', {
                expiresIn: '7d'
              }
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;