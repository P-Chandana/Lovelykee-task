const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');
const { forwardAuthenticateds } = require('../config/auths');

// Login Page
router.get('/logini', forwardAuthenticated, (req, res) => res.render('logini'));
router.get('/logins', forwardAuthenticateds, (req, res) => res.render('logins'));
router.get('/login', forwardAuthenticateds, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { role,name, email, password, password2 } = req.body;
  let errors = [];

  if (!role || !name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      role,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          role,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          role,
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                if(role=="staff"){
                  res.redirect('/users/logins');

                }else{
                  res.redirect('/users/logini');
                }
                
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/logini', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboardi',
    failureRedirect: '/users/logini',
    failureFlash: true
  })(req, res, next);
});
router.post('/logins', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboards',
    failureRedirect: '/users/logins',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('welcome');
});

module.exports = router;
