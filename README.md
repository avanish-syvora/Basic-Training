# Node.js HTTP Server – Vanilla & Express Version

This project demonstrates two implementations of a basic JSON-backed API using Node.js:

1. A raw HTTP server using the `http` and `fs` modules.
2. An Express-based server with cleaner routing and middleware.

Both versions support `GET` and `POST` methods to **read from** and **write to** a `data.json` file.

---

##  Project Structure

```
http-server-json/
├── data.json                  # JSON file used for reading/writing
├── server.js              # HTTP server using core Node.js modules
├── express-server.js          # Same functionality implemented using Express
├── package.json
```

---

##  Requirements

* Node.js v14+
* npm (pre-installed with Node)

---

##  Setup

```bash
npm install express
```

---

## Run the Servers

### Raw HTTP Server:

```bash
node server.js
```

### Express Server:

```bash
node express-server.js
```

Both servers listen on **[http://localhost:3000](http://localhost:3000)**

---

## API Endpoints

### `GET /data`

* Reads and returns the content of `data.json`.

#### Response Example:

```json
[
  {
    "name": "Avanish",
    "role": "Backend"
  }
]
```

---

### `POST /data`

* Accepts a JSON object in request body and appends it to `data.json`.

#### Request Body:

```json
{
  "name": "Sample name",
  "role": "Frontend"
}
```

#### Success Response:

```json
{
  "message": "Data saved successfully"
}
```

---

##  Difference: Raw HTTP vs Express

| Feature        | Raw HTTP Version       | Express Version                        |
| -------------- | ---------------------- | -------------------------------------- |
| Parsing Body   | Manual stream handling | `express.json()` middleware            |
| Routing        | `if/else` blocks       | `.get()` and `.post()` cleanly defined |
| Error Handling | Manual                 | Built-in status handling               |
| Scalability    | Low                    | High (middleware stack, router, etc.)  |

---

##  Raw Server Code Overview (`server.js`)

* Uses:

  * `http.createServer`
  * `fs.readFileSync`, `fs.writeFileSync`
  * JSON parsing manually from `data` stream
* Manual routing and body parsing

---

##  Express Server Code Overview (`express-server.js`)

* Uses:

  * `express.json()` to parse JSON bodies
  * `fs.readFileSync` and `fs.writeFileSync` for file ops
  * Express route handlers: `app.get`, `app.post`
  * Middleware to handle invalid routes (`404`)

---

##  Example Test (using curl or Postman)

```bash
curl -X POST http://localhost:3000/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "role": "DevOps"}'
```

---

