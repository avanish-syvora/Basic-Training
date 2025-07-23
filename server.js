const http = require('http');
const fs = require('fs');
const path = require('path');

// Path to the data file
const dataFile = path.join(__dirname, 'data.json');

// Utility: Read JSON safely
function readJSONFile() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Utility: Write JSON safely
function writeJSONFile(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Create server
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Enable CORS + JSON headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (url === '/data' && method === 'GET') {
    // Read data from file and send it
    const data = readJSONFile();
    res.writeHead(200);
    res.end(JSON.stringify(data));

  } else if (url === '/data' && method === 'POST') {
    // Collect request body
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const current = readJSONFile();

        current.push(incoming); // Append new data
        writeJSONFile(current); // Save back

        res.writeHead(201);
        res.end(JSON.stringify({ message: 'Data saved successfully.' }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
      }
    });

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found.' }));
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});