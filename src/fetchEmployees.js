const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const API_URL = 'https://dummyjson.com/users';
const OUTPUT_DIR = path.join(process.cwd(), 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

async function fetchAndSaveEmployees() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filePath = path.join(OUTPUT_DIR, `employees_${timestamp}.json`);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Employee data saved to: ${filePath}`);
  } catch (err) {
    console.error('❌ Failed to fetch data:', err.message);
  }
}

fetchAndSaveEmployees();
