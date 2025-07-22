// matcher.js
const { scoreTechAgainstJob } = require("./scorer");

function enrichJobsWithTechnologies(jobs, technologies) {
  return jobs.map(job => {
    const matchedTechs = technologies
      .map(tech => scoreTechAgainstJob(job, tech))
      .filter(Boolean); // remove nulls

    return { ...job, technologies: matchedTechs };
  });
}

module.exports = { enrichJobsWithTechnologies };