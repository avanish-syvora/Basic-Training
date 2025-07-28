#  Node.js Login/Signup App (with PostgreSQL + Sequelize + Roles + MIgrate & Seed)
---

##  Features

* Secure Signup/Login with sessions
* Middleware-based route protection
* Sequelize-powered PostgreSQL ORM
* Role-based access control (via `role` field in User model)
* EJS views with basic form rendering
* Modular MVC structure
* Sequelize CLI migrations and seeds

---

##  Folder Structure

```
Basic-Training/
├── config/
│   └── db.js                  # Sequelize DB config
├── controllers/
│   └── authController.js      # Handles login/signup logic
├── models/
│   └── user.js                # Sequelize User model
├── migrations/
│   └── <timestamp>-add-role-to-users.js
├── seeders/
│   └── <timestamp>-seed-users.js
├── public/
│   └── uploads/               # Uploaded files
├── routes/
│   └── authRoutes.js          # All routing logic
├── views/
│   ├── login.ejs
│   ├── signup.ejs
│   └── dashboard.ejs
├── server.mjs                # Entry point
├── .env
├── package.json
```

---

##  Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Create `.env` file:**

```env
DB_NAME=auth_demo
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
```

3. **Run Sequelize migrations and seeds:**

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

4. **Start server:**

```bash
node server.mjs
```

Visit: `http://localhost:3000`

---

##  Role Support

The `User` model includes a `role` field:

```js
role: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'user'
}
```

You can use this to protect routes:

```js
if (req.session.user && req.session.user.role === 'admin') {
  // Allow access
}
```

---

##  Scripts

```json
"scripts": {
  "start": "node server.mjs",
  "dev": "nodemon server.mjs",
  "migrate": "npx sequelize-cli db:migrate",
  "seed": "npx sequelize-cli db:seed:all"
}
```

---

##  Sample Seeded Users

| Username | Password            | Role  |
| -------- | ------------------- | ----- |
| admin1   | hashed\_admin\_pass | admin |
| user1    | hashed\_user\_pass  | user  |

(*Note: Use hashed passwords in production*)

---

##  Tech Stack

* Express.js
* Sequelize ORM
* PostgreSQL
* EJS
* express-session
* dotenv
* cookie-parser
