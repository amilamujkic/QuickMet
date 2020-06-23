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

//sign-up route

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


//login route

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

//forgot password routes

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


//profile picture route

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
              var sql = "INSERT INTO `User`('ProfilePicture') VALUES (img_name)";
              var query = db.query(sql, function(err, result) {
                 res.redirect('profile/'+result.insertId);
              });
           });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        }
});


// fetching friends route

router.get('/user/friends', async (req, res) => {
  var user = 1;
  var conn = await connection(db).catch(e => {});
  var friends = await query(conn, `SELECT User.FirstName, User.Surname FROM Friendship, User
  WHERE Friendship.SecondUserID = User.UserID and Friendship.FirstUserID = ? and isRequested = false`, [user])
  return res.status(200).send(friends);
});

// adding slots route


router.post('/slots/add', function(req, res) {

  let stmt = `INSERT INTO Slot (StartDate, Duration, Destination, Notes)  VALUES ((${db.escape(
    req.body.StartDate, req.body.Duration, req.body.Destination, req.body.Notes)}))`;

  let stmu = `INSERT INTO Slot (MeetingTypeID) SELECT CategoryID FROM Categories WHERE LOWER(Categories.CategoryName) = LOWER((${db.escape(
    req.body.CategoryName
  )}))`;

  let stmv = `INSERT INTO Slot (FirstUserID) SELECT UserID FROM User WHERE User.UserID = ?`;

  let stmz = `UPDATE Friendship (isBanned) SET isBanned = true WHERE Friendship.SecondUserID = User.UserID 
  and Friendship.FirstUserID = ? and LOWER(User.FirstName) = LOWER((${db.escape(
    req.body.FirstNameBan
  )})) and LOWER(User.FirstName) = LOWER((${db.escape(
    req.body.SurnameBan
  )})) `;

  let stmy = `UPDATE Friendship (isBanned) SET isBanned = false WHERE Friendship.SecondUserID = User.UserID 
  and Friendship.FirstUserID = ? and LOWER(User.FirstName) = LOWER((${db.escape(
    req.body.FirstNameBan
  )})) and LOWER(User.FirstName) = LOWER((${db.escape(
    req.body.SurnameBan
  )})) `;

  connection(db).query(stmt, stmu, stmv, stmz, stmy, (err, results) => {
  if (err) {
   return res.status(500).send('Something is missing. Check it out.');
  }
    return res.status(200);
  });

});

// listing slots of the user

router.get('/slots', async (req, res) => {

  var user = 1;
  var conn = await connection(db).catch(e => {});
  var slots = await query(conn, 
    `SELECT Slot.StartDate, Slot.Duration, Categories.CategoryName, Slot.Destination,  Slot.isBooked, Slot.Notes
     FROM Slot, Categories
     WHERE Categories.CategoryID = Slot.MeetingTypeID 
      and (Slot.FirstUserID = ? or Slot.SecondUserID = ?) 
      and (Slot.StartDate + Slot.Duration > CURRENT_TIMESTAMP)
     ORDERBY Slot.StartDate`, [user])
  return res.status(200).send(slots);

});

// deleting slots of the user

router.post('/slots/delete', function(req, res) {

  let deletion = `DELETE * FROM Slot WHERE SlotID = (${db.escape(req.body.SlotID)}) and isBooked = false`;

  connection(db).query(deletion, (err, results) => {
  if (err) {
   return res.status(500).send('Could not delete it. Error!');
  }
    return res.status(200);
  });

});

// searching for user

router.post('/search', userMiddleware.isLoggedIn, function(req, res) {

  var found = db.query(`SELECT User.FirstName, User.Surname FROM User
  WHERE LOWER(User.FirstName) = LOWER(${db.escape(
    req.body.friendname
  )}) and LOWER(User.Surname) = LOWER(${db.escape(
    req.body.friendsurname
  )})`);

  if(err) {
    return res.status(400);
  }
  else { return res.status(200).send(found); }
  });

// friend request

router.post('/user/add', userMiddleware.isLoggedIn, function(req, res) {

  db.query(`INSERT INTO Friendship (FirstUserID, SecondUserID, isRequested) 
  VALUES ?, User.SecondUserID WHERE User.FirstName = ${db.escape(
    req.body.FirstName
  )}) and User.Surname = ${db.escape(
    req.body.Surname
  )}), true`);

  if(err) {
    return res.status(400);
  }
  else { 
    var msg = "User added!"
    return res.status(200).send(msg); }
  });

// delete friend

router.post('/user/delete', userMiddleware.isLoggedIn, function(req, res) {

  db.query(`DELETE FROM Friendship WHERE (Friendship.FirstUserID = User.UserID and User.FirstName = ${db.escape(
    req.body.FUFirstName
  )}) and User.Surname = ${db.escape(
    req.body.FUSurname
  )})) and (Friendship.SecondUserID = User.UserID and User.FirstName = ${db.escape(
    req.body.SUFirstName
  )}) and User.Surname = ${db.escape(
    req.body.SUSurname
  )}))`);

  if(err) {
    return res.status(400);
  }
  else { 
    var msg = "User deleted from friends!"
    return res.status(200).send(msg); }
  });
  
// accept/decline friend request

router.post('/user/request', userMiddleware.isLoggedIn, function(req, res) {

  var action = req.body.action; 

  if(action === "accept") {
  db.query(`UPDATE Friendship SET isFriend = true  and isRequested = false WHERE Friendship.FirstUserID = User.UserID and User.FirstName = ${db.escape(
    req.body.FUFirstName
  )}) and User.Surname = ${db.escape(
    req.body.FUSurname
  )})) and (Friendship.SecondUserID = User.UserID and User.FirstName = ${db.escape(
    req.body.SUFirstName
  )}) and User.Surname = ${db.escape(
    req.body.SUSurname
  )}))`);
  }
  else {
    if(action === "accept") {
      db.query(`UPDATE Friendship SET isFriend = false  and isRequested = false WHERE Friendship.FirstUserID = User.UserID and User.FirstName = ${db.escape(
        req.body.FUFirstName
      )}) and User.Surname = ${db.escape(
        req.body.FUSurname
      )})) and (Friendship.SecondUserID = User.UserID and User.FirstName = ${db.escape(
        req.body.SUFirstName
      )}) and User.Surname = ${db.escape(
        req.body.SUSurname
      )}))`);
      }
  }

  if(err) {
    return res.status(400);
  }
  else { 
    var msg = "Action done!"
    return res.status(200).send(msg); }
  });


// mutual meetings

router.post('/friends/slots', userMiddleware.isLoggedIn, function(req, res) {
  
    var slotslist = db.query(`SELECT Slot.StartDate, Slot.Duration, Categories.CategoryName, Slot.Destination, Slot.Notes
    FROM Slot, Categories
    WHERE Categories.CategoryID = Slot.MeetingTypeID 
     and (Slot.FirstUserID = User.UserID and User.FirstName = ${db.escape(
      req.body.FUFirstName
    )}) and User.Surname = ${db.escape(
      req.body.FUSurname
    )})) and (Friendship.SecondUserID = User.UserID and User.FirstName = ${db.escape(
      req.body.SUFirstName
    )}) and User.Surname = ${db.escape(
      req.body.SUSurname
    )}))
    ORDERBY Slot.StartDate`);
  
    if(err) {
      return res.status(400);
    }
    else { 
      return res.status(200).send(slotslist); };
    });

module.exports = router;