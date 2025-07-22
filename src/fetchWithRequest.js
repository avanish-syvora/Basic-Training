import request from 'request-promise';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

const API_URL = 'https://dummyjson.com/users';
const OUTPUT_DIR = path.join(process.cwd(), 'output');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function fetchUsingRequest() {
  try {
    const data = await request({ uri: API_URL, json: true });
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filePath = path.join(OUTPUT_DIR, `users_from_request_${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved to ${filePath}`);
  } catch (err) {
    console.error('Error using request:', err.message);
  }
}

fetchUsingRequest();
