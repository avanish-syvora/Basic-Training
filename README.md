#  Node.js Auth App (Sequelize + EJS + Google OAuth)

A fully functional **login/signup system** built using Express, Sequelize (PostgreSQL), and Passport.js with support for:

* Traditional **email/password** auth
* **Google OAuth 2.0** login
* Sessions and Cookies for authentication
* EJS templating engine
* Modular MVC structure

---

##  Tech Stack

| Tool                | Purpose                          |
| ------------------- | -------------------------------- |
| **Express**         | Web framework                    |
| **Sequelize**       | ORM for PostgreSQL               |
| **Passport.js**     | Auth strategies (Google & Local) |
| **EJS**             | View rendering engine            |
| **bcrypt**          | Password hashing                 |
| **dotenv**          | Environment config               |
| **express-session** | Cookie-based user sessions       |

---

## Folder Structure

```
project-root/
├── config/
│   └── db.js               # Sequelize connection setup
│   └── passport.js         # Google OAuth strategy
├── controllers/
│   └── authController.js   # Signup/Login/Dashboard logic
├── models/
│   └── user.js             # Sequelize User model
├── routes/
│   ├── authRoutes.js       # Local and Google routes
│   └── userRoutes.js       # User listing route
├── views/
│   ├── signup.ejs
│   ├── login.ejs
│   ├── dashboard.ejs
│   └── users.ejs
├── public/                 # Static assets
├── .env
├── server.mjs              # App entry point
└── package.json
```

---

##  Environment Setup (`.env`)

```env
DATABASE_URL=postgres://username:password@localhost:5432/auth_demo
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=random_session_secret
```

Replace with your actual PostgreSQL and Google credentials.

---

##  Features

*  Secure user authentication via email/password
*  Google Sign-In using Passport OAuth2 strategy
*  Persistent sessions using `express-session`
*  All users displayed in a styled EJS HTML table
*  Passwords are hashed securely using `bcrypt`
*  Beautifully styled views using EJS templating

---

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Setup PostgreSQL

Create a DB manually (e.g. via `psql`):

```sql
CREATE DATABASE auth_demo;
```

### 3. Run the Server

```bash
node server.mjs
```

Visit: [http://localhost:3000](http://localhost:3000)

---

##  Google OAuth Setup

1. Go to: [Google Developer Console](https://console.developers.google.com/)
2. Create a project → Enable "Google+ API"
3. Set OAuth credentials with:

   * Redirect URI: `http://localhost:3000/auth/google/callback`
4. Add keys to `.env`

---

##  Auth Routes

| Route                   | Method   | Description                     |
| ----------------------- | -------- | ------------------------------- |
| `/signup`               | GET/POST | Render and process signup       |
| `/login`                | GET/POST | Render and process login        |
| `/dashboard`            | GET      | Protected route                 |
| `/logout`               | GET      | Destroys session                |
| `/auth/google`          | GET      | Start Google OAuth              |
| `/auth/google/callback` | GET      | OAuth callback handler          |
| `/users`                | GET      | Display all users in HTML table |

---

##  Sample UI

> Screens:

*  Signup Form
* Login Form
*  Dashboard with session info
*  Users table rendered via `users.ejs`

---

