import express from 'express';
import multer from 'multer';
import path from 'path';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/signup', (req, res) => res.sendFile(path.resolve('views/signup.html')));
router.get('/login', (req, res) => res.sendFile(path.resolve('views/login.html')));

router.post('/signup', upload.single('avatar'), signup);
router.post('/login', login);

export default router;