import fs from 'fs-extra';
const dataFile = './data/users.json';

export async function getUsers() {
  const exists = await fs.pathExists(dataFile);
  if (!exists) return [];
  return fs.readJSON(dataFile);
}

export async function saveUser(user) {
  const users = await getUsers();
  users.push(user);
  await fs.writeJSON(dataFile, users, { spaces: 2 });
}