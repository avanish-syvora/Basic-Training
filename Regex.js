/*  Password Regex
-- Allows A-Z, a-z, 0-9, special characters, dot (.) with rules:
 - Dot not at start or end
 - Dot not repeated (no "..")*/
const passwordRegex = /^(?!\.)(?!.*\.\.)(?!.*\.$)[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~.]+$/;

// 2. Email Address Regex
// Standard email pattern with local part, @, domain and TLD
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i;

//  3. Credit Card 
// Matches Visa, MasterCard, Amex, Discover
const creditCardRegex = /^(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|6(?:011|5\d{2})\d{12})$/;   

//  4. Extract Emails and Phone Numbers from Paragraph
function extractInfo(text) {
  // Email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}\b/g;

  // Phone number pattern:
  // Matches 10-digit numbers with or without +91 or separators
  const phonePattern = /(?:\+91[-\s]?)?(?:\(\+91\)[-\s]?)?\d{5}[-\s]?\d{5}\b/g;

  // Applying patterns
  const emails = text.match(emailPattern) || [];
  const phones = text.match(phonePattern) || [];

  return { emails, phones };
}

//  Example Usage

const testPassword1 = "Valid123!password";
const testPassword2 = ".invalidpassword.";
console.log("Password 1 valid:", passwordRegex.test(testPassword1)); // true
console.log("Password 2 valid:", passwordRegex.test(testPassword2)); // false

const testEmail = "user.name@example.co.in";
console.log("Email valid:", emailRegex.test(testEmail)); // true

const testCard = "4111111111111111"; // Visa
console.log("Credit Card valid:", creditCardRegex.test(testCard)); // true

const paragraph = `
Lorem ipsum dolor 9221122108 sit amet, consectetur adipiscing elit.
mytraining@deqode.com Fusce (+91)-20200-21210 ut placerat mt@test.inc orci nulla.
Call us at +91-20200-21210 or email support@example.org.
`;

const extracted = extractInfo(paragraph);
console.log("Extracted Emails:", extracted.emails);
console.log("Extracted Phone Numbers:", extracted.phones);
