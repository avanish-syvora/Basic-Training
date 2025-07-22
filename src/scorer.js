// scorer.js
function scoreTechAgainstJob(job, tech) {
  const text = (job.title + " " + job.description).toLowerCase();
  let score = 0;
  let matchedFrom = [];

  for (const keyword of tech.synonyms) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
      matchedFrom.push(keyword);
    }
    // Bonus if the tech appears in title
    const titleMatch = job.title.toLowerCase().includes(keyword);
    if (titleMatch) score += 2;
  }

  // Set confidence label
  let confidence = "low";
  if (score >= 4) confidence = "high";
  else if (score >= 2) confidence = "medium";

  return score > 0
    ? {
        name: tech.name,
        score,
        matchedFrom: [...new Set(matchedFrom)],
        confidence
      }
    : null;
}

module.exports = { scoreTechAgainstJob };