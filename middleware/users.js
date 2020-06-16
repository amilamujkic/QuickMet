module.exports = {
    validateRegister: (req, res, next) => {
      if (!req.body.FirstName) {
        return res.status(400).send({
          msg: 'Please enter your first name.'
        });
      }
      if (!req.body.Surname) {
        return res.status(400).send({
          msg: 'Please enter your last name.'
        });
      }
      if (!req.body.EmailAddress) {
        return res.status(400).send({
          msg: 'Please enter your email address.'
        });
      }
      // password min 6 chars
      if (!req.body.Password || req.body.Password.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
      }
      next();
    },
    isLoggedIn: (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          'SECRETKEY'
        );
        req.userData = decoded;
        next();
      } catch (err) {
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
    }
  };