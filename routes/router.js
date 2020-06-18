const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
     user: process.env.user,
     pass: process.env.pass
  }
});

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM User WHERE LOWER(EmailAddress) = LOWER(${db.escape(
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
              `INSERT INTO User (FirstName, Surname, EmailAddress, Password) VALUES ('${uuid.v4()}', ${db.escape(
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
                  msg: 'User registered'
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
    `SELECT * FROM User WHERE EmailAddress = ${db.escape(req.body.EmailAddress)};`,
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


router.get('/forgot-password', function(req, res, next) {
  res.render('user/forgot-password', { });
});


router.post('/forgot-password', async function(req, res, next) {
  var email = await User.findOne({where: { email: req.body.email }});
  if (email == null) {
    return res.json({status: 'ok'});
  }
  await ResetToken.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
  var fpSalt = crypto.randomBytes(64).toString('base64');
  var expireDate = new Date();

  expireDate.setDate(expireDate.getDate() + 1/24);
   await ResetToken.create({
    email: req.body.email,
    expiration: expireDate,
    token: token,
    used: 0
  });
 
  const message = {
      from: process.env.SENDER_ADDRESS,
      to: req.body.email,
      replyTo: process.env.REPLYTO_ADDRESS,
      subject: process.env.FORGOT_PASS_SUBJECT_LINE,
      text: 'To reset your password, please click the link below.\n\nhttps://'+process.env.DOMAIN+'/user/reset-password?token='+encodeURIComponent(token)+'&email='+req.body.email
  };
 
  transport.sendMail(message, function (err, info) {
     if(err) { console.log(err)}
     else { console.log(info); }
  });
  return res.json({status: 'ok'});
});


router.post('/user/profilepicture', userMiddleware.isLoggedIn, (req, res, next) => {
  message = '';
  if (!req.files)
      return res.status(400).send('No files were uploaded.');

  var file = req.files.uploaded_image;
  var img_name=file.name;

     if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                               
            file.mv('/user/profilepicture'+file.name, function(err) {
                           
              if (err)

                return res.status(500).send(err);
              var sql = "INSERT INTO `Users`('ProfilePicture') VALUES (img_name)";
              var query = db.query(sql, function(err, result) {
                 res.redirect('profile/'+result.insertId);
              });
           });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        }
});




module.exports = router;