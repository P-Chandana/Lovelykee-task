const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboardi', ensureAuthenticated, (req, res) =>
  res.render('dashboardi', {
    user: req.user
  })
);
router.get('/dashboards', ensureAuthenticated, (req, res) =>
  res.render('dashboards', {
    user: req.user
  })
);

module.exports = router;
