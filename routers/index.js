const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth/google', () => console.log('hi'));

router.get('/oauth2callback', passport.authenticate(
  "google",
  { 
    successRedirect: "/home",
    //can redirect to whatever you want
    failureRedirect: "/"
  }
));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;