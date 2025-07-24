import { getUsers, saveUser } from '../models/userModel.js';

export async function signup(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Missing fields');

  const avatar = req.file ? `/uploads/${req.file.filename}` : null;
  const user = { username, password, avatar };
  await saveUser(user);
  res.redirect('/login');
}

export async function login(req, res) {
  const { username, password } = req.body;
  const users = await getUsers();
  const found = users.find(u => u.username === username && u.password === password);

  if (!found) return res.send('Invalid credentials');
  req.session.user = found;
  res.send(`<h1>Welcome ${found.username}</h1><img src="${found.avatar}" width="100" />`);
}