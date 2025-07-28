import bcrypt from 'bcrypt';
import User from '../models/user.js';

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ where: { username } });
    if (exists) return res.send('User already exists');

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.redirect('/login');
  } catch (err) {
    res.send('Signup error');
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Incorrect password');

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Login error');
  }
};

export const dashboard = (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};