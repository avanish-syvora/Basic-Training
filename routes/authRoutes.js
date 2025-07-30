import express from 'express';
import passport from 'passport';
import { signup, login, dashboard, logout } from '../controllers/authController.js';

const router = express.Router();

// Username/password
router.get('/signup', (_, res) => res.render('signup'));
router.post('/signup', signup);

router.get('/login', (_, res) => res.render('login'));
router.post('/login', login);

router.get('/dashboard', dashboard);
router.get('/logout', logout);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  })
);

export default router;