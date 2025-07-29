#  Login/Signup App with PostgreSQL, Sequelize, Sessions & EJS

This project is a full-stack Express.js application implementing authentication (login/signup) using PostgreSQL with Sequelize ORM. It follows MVC architecture, stores user roles, manages sessions, handles file uploads, and displays all registered users in a styled EJS-powered table.

---

## Features

* User Registration and Login (Email + Password)
* Session-based Authentication using `express-session`
* Stores user data in PostgreSQL using Sequelize ORM
* EJS Templating for rendering pages
* Role support with default value
* View all users in a styled HTML table (`/users` route)
* MVC (Model-View-Controller) Architecture
* `.env` support for configuration

---

##  Project Structure

```
basic-training/
├── config/
│   └── db.js               # Sequelize DB setup
├── controllers/
│   ├── authController.js   # Signup/Login logic
│   └── userController.js   # User listing logic
├── models/
│   └── user.js             # Sequelize User model
├── public/
│   └── ...                 # Static files (CSS/images if needed)
├── routes/
│   ├── authRoutes.js       # Signup/Login routes
│   └── userRoutes.js       # User display route
├── views/
│   ├── signup.ejs
│   ├── login.ejs
│   └── users.ejs           # Styled table of users
├── .env
├── server.mjs              # Entry point
├── package.json
```

---

##  Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/avanish-syvora/Basic-Training
cd basic-training
npm install
```

### 2. Setup PostgreSQL

* Install PostgreSQL locally.
* Create a database manually using `psql` or a GUI tool:

```bash
createdb auth_demo
```

### 3. Configure `.env`

Create a `.env` file in the root directory:

```env
DB_NAME=auth_demo
DB_USER=your_postgres_username
DB_PASS=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=something_secret
```

Replace values with your actual PostgreSQL credentials.

---

##  Running the App

```bash
node server.mjs
```

Visit:

* `http://localhost:3000/signup` – To create a new user
* `http://localhost:3000/login` – To login
* `http://localhost:3000/users` – View all registered users in a styled table

---

##  Technologies Used

| Technology          | Purpose                             |
| ------------------- | ----------------------------------- |
| **Express.js**      | Web server and routing              |
| **EJS**             | View engine for rendering templates |
| **Sequelize**       | ORM for PostgreSQL                  |
| **express-session** | Session management                  |
| **dotenv**          | Environment variable management     |
| **PostgreSQL**      | Relational database                 |

---

##  Sample Routes

| Route          | Description                    |
| -------------- | ------------------------------ |
| `GET /signup`  | Show signup form               |
| `POST /signup` | Create user and store session  |
| `GET /login`   | Show login form                |
| `POST /login`  | Authenticate and store session |
| `GET /users`   | View all users in HTML table   |

