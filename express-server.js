const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(express.json());

// GET /data == Read and return the JSON file
app.get('/data', (req, res) => {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    const data = JSON.parse(raw);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data.json' });
  }
});

// POST /data = Append a new object to the file
app.post('/data', (req, res) => {
  const incoming = req.body;

  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  try {
    let current = [];
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf-8');
      current = JSON.parse(raw);
    }

    current.push(incoming);
    fs.writeFileSync(dataFile, JSON.stringify(current, null, 2));
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error writing to file' });
  }
});

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});