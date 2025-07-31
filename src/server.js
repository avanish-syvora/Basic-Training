import express from 'express';
import multer from 'multer';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve the HTML form
app.use(express.static('public'));

// Multer config to store uploaded file in 'uploads/'
const upload = multer({ dest: 'uploads/' });

// Upload route
app.post('/upload', upload.single('textfile'), async (req, res) => {
  const filePath = req.file.path;
  const wordFrequency = {};

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, 'utf8'),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const words = line
      .replace(/[^\w\s]/g, '')
      .toLowerCase()
      .split(/\s+/);

    for (const word of words) {
      if (!word) continue;
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  }

  // // Delete uploaded file after use
  // fs.unlinkSync(filePath);

  // Display output
  res.send(`
    <h2>Word Frequency Result:</h2>
    <pre>${JSON.stringify(wordFrequency, null, 2)}</pre>
    <a href="/">Upload another</a>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});