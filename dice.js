// Unicode characters for dice faces from ⚀ (U+2680) to ⚅ (U+2685)
const diceFaces = Array.from({ length: 6 }, (_, i) => String.fromCharCode(0x2680 + i));

// Score state for each player
let scores = { p1: 0, p2: 0 };

// Tracks if the game has ended
let winnerDeclared = false;

// Tracks whose turn it is: 'p1' or 'p2'
let currentTurn = 'p1';

// Helper function to get element by CSS selector
const get = (sel) => document.querySelector(sel);

// Simulates a dice roll between 1 and 6
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Adds random rotation to simulate animation effect
function rotateDice(el) {
  const deg = 360 + Math.floor(Math.random() * 360); // Adds randomness
  el.style.transform = `rotate(${deg}deg)`;
}

// Updates dice face display and rotates them visually
function updateDiceDisplay(player, roll1, roll2) {
  const dice1 = get(`#${player}-dice1`);
  const dice2 = get(`#${player}-dice2`);

  dice1.innerText = diceFaces[roll1 - 1];
  dice2.innerText = diceFaces[roll2 - 1];

  rotateDice(dice1);
  rotateDice(dice2);
}

// Updates player's score based on roll
function updateScore(player, roll1, roll2) {
  // If either dice rolls a 1, score resets to 0
  if (roll1 === 1 || roll2 === 1) {
    scores[player] = 0;
  } else {
    scores[player] += roll1 + roll2;
  }

  // Update the score on the UI
  get(`#${player}-score`).innerText = `Score: ${scores[player]}`;
}

// Declares winner if score reaches 25 or above
function checkWinner() {
  if (scores.p1 >= 50) {
    get("#result").innerText = "🎉 Avanish Wins!";
    winnerDeclared = true;
  } else if (scores.p2 >= 50) {
    const name = get("#player2-name").innerText;
    get("#result").innerText = `🎉 ${name} Wins!`;
    winnerDeclared = true;
  }
}

// Main handler for rolling logic
function handleRoll(player) {
  if (winnerDeclared) return;

  // Enforce turn-based rolling
  if (player !== currentTurn) return;

  const roll1 = rollDice();
  const roll2 = rollDice();

  updateDiceDisplay(player, roll1, roll2);
  updateScore(player, roll1, roll2);
  checkWinner();

  // Switch turn: if p1 just rolled, p2 gets next turn, and vice versa
  currentTurn = player === 'p1' ? 'p2' : 'p1';

  // Enable/Disable buttons accordingly
  updateButtons();
}

// Enable only current player's button, disable the other
function updateButtons() {
  get("#p1-roll").disabled = currentTurn !== 'p1';
  get("#p2-roll").disabled = currentTurn !== 'p2';
}

// Reset game to initial state
get("#reset").addEventListener("click", () => {
  scores = { p1: 0, p2: 0 };
  winnerDeclared = false;
  currentTurn = 'p1'; 

  ["p1", "p2"].forEach(p => {
    get(`#${p}-score`).innerText = "Score: 0";
    get(`#${p}-dice1`).innerText = "🎲";
    get(`#${p}-dice2`).innerText = "🎲";
    get(`#${p}-dice1`).style.transform = "rotate(0deg)";
    get(`#${p}-dice2`).style.transform = "rotate(0deg)";
  });

  get("#result").innerText = "";
  updateButtons(); // Restore button states
});

// Event listeners for roll buttons
get("#p1-roll").addEventListener("click", () => handleRoll("p1"));
get("#p2-roll").addEventListener("click", () => handleRoll("p2"));

// Set player 2 name dynamically and update button label
get("#set-name").addEventListener("click", () => {
  const name = get("#name-input").value.trim();
  if (name) {
    get("#player2-name").innerText = name;
    get("#p2-title").innerText = `${name} 🎲`;
    get("#p2-roll").innerText = `${name} Rolls`;
  }
});

// Initial state - set correct buttons
updateButtons();
