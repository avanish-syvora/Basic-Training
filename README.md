# Tag Jobs CLI Tool

A powerful and extensible Node.js tool that tags job listings with relevant technologies based on their title and description. Designed for clean engineering reviews with a modular structure, scoring mechanism, and confidence levels.

---

##  Features

* Parses jobs and technologies from JSON
* Matches technologies using synonym detection and regex
* Assigns relevance `score` and `confidence` to each tag
* Outputs enriched job listings in timestamped JSON files
* Modular and testable code (separate scorer and matcher)

---

##  Folder Structure

```
tag-jobs/
├── data/
│   ├── jobs.json                # Input job listings
│   └── technologies.json        # List of technologies with synonyms
├── output/                      # Auto-generated enriched job files
├── src/
│   ├── matcher.js               # Handles matching technologies to jobs
│   ├── scorer.js                # Calculates scores and confidence
│   └── index.js                 # Main runner
├── package.json
```

---

##  Example Job Entry (`data/jobs.json`)

```json
{
  "id": 1,
  "title": "Senior React Developer",
  "description": "Looking for a React.js developer experienced with Redux and JavaScript frameworks. Exposure to REST APIs and Node is preferred."
}
```

---

##  How Tagging Works

Each job is scored against every technology:

* A tech gets points if its synonyms are found in the job's `title` or `description`
* Title matches get **bonus points**
* Each tech's match includes:

  * `score` (based on number and quality of matches)
  * `matchedFrom` (list of matching keywords)
  * `confidence` (low, medium, high based on score)


---

##  Dependencies

* [`fs`](https://nodejs.org/api/fs.html) – for reading/writing files
* [`path`](https://nodejs.org/api/path.html) – for platform-safe file paths
* [`moment`](https://momentjs.com/) – for timestamped filenames

Install dependencies:

```bash
npm install moment
```
---

##  Running the Tool

```bash
node src/index.js
```

 Output will be saved in `/output/enriched_jobs_<timestamp>.json`.



---


##  Sample Output (inside `/output/`)

```json
{
  "id": 1,
  "title": "Senior React Developer",
  "description": "Looking for a React.js developer experienced with Redux and JavaScript...",
  "technologies": [
    {
      "name": "React",
      "score": 5,
      "matchedFrom": ["react", "react.js"],
      "confidence": "high"
    },
    {
      "name": "JavaScript",
      "score": 2,
      "matchedFrom": ["javascript", "js"],
      "confidence": "medium"
    },
    {
      "name": "Redux",
      "score": 2,
      "matchedFrom": ["redux"],
      "confidence": "medium"
    }
  ]
}
```

