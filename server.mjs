import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport.js';

import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);

// DB and server
(async () => {
  await sequelize.sync();
  app.listen(3000, () => console.log('http://localhost:3000'));
})();