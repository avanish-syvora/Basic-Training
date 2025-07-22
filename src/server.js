
// server.js
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const jobs = require("../data/jobs.json");
const technologies = require("../data/technologies.json");

const { enrichJobsWithTechnologies } = require("./matcher");

// Enrich jobs
const enriched = enrichJobsWithTechnologies(jobs, technologies);

// Prepare output filename
const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
const outFile = path.join(__dirname, "../output/enriched_jobs_" + timestamp + ".json");

// Write to file
fs.writeFileSync(outFile, JSON.stringify(enriched, null, 2));

console.log(`Enriched job data written to ${outFile}`);