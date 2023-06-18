const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);

router.get('/forgot-password', usersController.forgotPassword);
router.post('/reset-password', usersController.resetPassword);
router.get('/reset-password/:token', usersController.showResetPasswordForm);
router.post('/reset-password/:token', usersController.updatePassword);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

/*
We will be creating two routes
-> When we will click on the button for google sign-in for fetching the data

-> When google fetches the data from the database and sends it back to the
routes which is the callback URL
*/

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// The scope is the information that we are looking to fetch - { profile, email}.
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession)

// Until and unless we ask for a refresh token it is not coming up.

module.exports = router;