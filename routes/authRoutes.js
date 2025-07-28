import express from 'express';
import { signup, login, dashboard, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/signup', (_, res) => res.render('signup'));
router.post('/signup', signup);

router.get('/login', (_, res) => res.render('login'));
router.post('/login', login);

router.get('/dashboard', dashboard);
router.get('/logout', logout);

export default router;