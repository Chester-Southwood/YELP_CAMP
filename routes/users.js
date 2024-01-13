const express         = require('express'),
      router          = express.Router(),
      passport        = require('passport'),
      User            = require('../models/user'),
      catchAsync      = require('./../utils/catchAsync'),
      {storeReturnTo} = require('./../middleware'),
      UserController  = require('./../controllers/users');

router.route('/register')
    .get(UserController.renderRegister)
    .post(catchAsync(UserController.register));

router.route('/login')
    .get(UserController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}) ,catchAsync(UserController.login));

router.route('/logout')
    .get(UserController.logout);

module.exports = router;