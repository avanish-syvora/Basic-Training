// server.mjs
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/user.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Static files like CSS, images, etc. will be served from /public
app.use(express.static('public'));

// Session config using secret from .env
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true
}));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Routing middleware
app.use(authRoutes);
app.use(userRoutes);

// Initialize and sync DB, then start server
(async () => {
  try {
    await sequelize.authenticate(); // Check DB connection
    await sequelize.sync();         // Sync models (
    app.listen(3000, () => {
      console.log(' Server running at http://localhost:3000');
    });
  } catch (err) {
    console.error(' Unable to connect to DB:', err);
  }
})();
