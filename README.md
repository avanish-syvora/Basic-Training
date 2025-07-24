# Login/Signup App (Node.js + Express)

A complete login/signup system built with Express.js using the MVC architecture. It supports:

* File-based user storage
* File uploads (e.g. avatar images)
* Session management and cookies
* Serving static files (CSS/images)
* Separation of concerns using MVC pattern

---

##  Features

* Sign up new users with avatar upload
* Login/logout with sessions and cookies
* Display personalized dashboard with uploaded avatar
* Store user data securely in a local JSON file
* Organize code with `controllers`, `models`, and `routes`
* Serve static assets from `public/`

---

##  Folder Structure

```
Basic-Training/
├── controllers/           # Request logic (login, signup, dashboard)
│   └── authController.js
├── models/                # Handles data I/O with JSON file
│   └── userModel.js
├── public/                # Static files (uploads, CSS)
│   ├── uploads/
│   └── style.css
├── routes/                # Express routing logic
│   └── authRoutes.js
├── views/                 # HTML form pages
│   ├── login.html
│   └── signup.html
├── data/                  # JSON storage for users
│   └── users.json
├── server.mjs                 # Entry point
├── package.json
```

---

##  Setup

```bash
npm install
```

---

##  Run the App

```bash
node server.mjs
```

Visit: [http://localhost:3000/signup](http://localhost:3000/signup)

---

##  How It Works

###  Session Handling

* Uses `express-session` to store the logged-in user data on the server
* Cookie named `connect.sid` stores the session ID in the browser

### File Upload

* Uses `multer` middleware to store avatars in `public/uploads/`
* Stores the uploaded filename in the user object

###  MVC Architecture

* **Controllers** handle routing logic and session flow
* **Models** manage reading/writing to `users.json`
* **Routes** link URLs to controller methods
* **Views** are HTML files served directly

---

##  Routes

| Method | Path         | Purpose                 |
| ------ | ------------ | ----------------------- |
| GET    | `/signup`    | Display signup form     |
| POST   | `/signup`    | Handle new registration |
| GET    | `/login`     | Show login form         |
| POST   | `/login`     | Authenticate user       |

---

##  Sample Login Flow

1. User visits `/signup` and uploads avatar + credentials
2. Data is saved to `data/users.json`
3. After signup, user is redirected to login page
4. On successful login, session is created
5. Dashboard greets user with their name and image

---

##  Dependencies

```json
{
  "express": "^4.x",
  "express-session": "^1.x",
  "cookie-parser": "^1.x",
  "multer": "^1.x"
}
```

---

