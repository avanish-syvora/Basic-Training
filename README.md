# Word Frequency Counter App (Node.js + Express)

A simple web application where users can upload `.txt` files, and the server will **stream-read** the content and **count word frequency** efficiently using Node.js streams.

---

##  Features

- Upload `.txt` files via browser
- Reads file using `readline` stream interface (no memory overload)
- Calculates word frequency
- Cleans punctuation and handles case-insensitive counting
- Deletes uploaded file after processing(optional--- uncomment in server.js)
- Displays result in browser

---

##  Project Structure

```

word-counter-app/
├── public/
│   └── index.html              # Upload form UI
├── uploads/                    # Temp folder for file uploads
├── src/
│   └── server.js               # Main Express server
├── package.json

```

---

##  How to Run

```bash
npm install
npm start
````

Then open: [http://localhost:3000](http://localhost:3000)

---

##  Upload File

Upload a `.txt` file from the form. The app:

1. Parses it using `readline` stream.
2. Splits into words (strips punctuation).
3. Builds a frequency map.
4. Deletes the uploaded file.
5. Displays frequency JSON in the browser.

---

##  Technologies Used

| Tool/Library   | Purpose                          |
| -------------- | -------------------------------- |
| **Express.js** | Web server and routing           |
| **Multer**     | File uploads                     |
| **fs**         | Reading and deleting files       |
| **readline**   | Stream line-by-line file reading |
| **path**       | Path operations                  |

---

## Example Output

```json
{
  "the": 15,
  "node": 4,
  "js": 4,
  "is": 6,
  "awesome": 3
}
```

---

##  Scripts

```json
"scripts": {
  "start": "node src/server.js"
}
```

---
