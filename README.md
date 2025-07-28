#  Node.js Auth App with PostgreSQL and Sequelize

A clean and modular login/signup app using:

* **Express.js** for routing and middleware
* **Sequelize ORM** with **PostgreSQL** as database
* **Sessions** for user authentication
* **EJS** for rendering frontend views
* **File-based config via `.env`**
* Clean MVC architecture

---

##  Project Structure

```
auth-app/
├── config/
│   └── db.js                # Sequelize DB config
├── models/
│   └── user.js              # Sequelize User model
├── public/                  # Static assets (CSS, etc.)
├── routes/
│   └── authRoutes.js        # GET/POST for login/signup
├── views/
│   ├── login.ejs
│   ├── signup.ejs
│   └── dashboard.ejs
├── .env                     # DB config and session secret
├── server.mjs               # Main app entrypoint
├── package.json
```

---

## Tech Stack

| Technology         | Role                            |
| ------------------ | ------------------------------- |
| `Express.js`       | HTTP Server and routing         |
| `Sequelize`        | ORM for PostgreSQL              |
| `pg` + `pg-hstore` | PostgreSQL driver for Sequelize |
| `express-session`  | Session management              |
| `EJS`              | Template engine for frontend    |
| `dotenv`           | Environment variable handling   |

---

##  Environment Configuration

Create a `.env` file in the root directory:

```env
DB_NAME=auth_demo
DB_USER=postgres
DB_PASS=your_password_here
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=keyboardcat123
```

---

##  Install Dependencies

```bash
npm install
```

---

##  Start the App

```bash
node server.mjs
```

The app will run on: [http://localhost:3000](http://localhost:3000)

---

##  Available Routes

| Route        | Type | Description              |
| ------------ | ---- | ------------------------ |
| `/signup`    | GET  | Render signup page       |
| `/signup`    | POST | Create user              |
| `/login`     | GET  | Render login page        |
| `/login`     | POST | Authenticate user        |
| `/dashboard` | GET  | Protected dashboard page |
| `/logout`    | GET  | Destroy session          |

---
