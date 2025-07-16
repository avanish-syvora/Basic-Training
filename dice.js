const diceFaces = [];
for (let i = 0; i < 6; i++) {
  diceFaces.push(String.fromCharCode(0x2680 + i));
}

function rollOneDice() {
  const roll = Math.floor(Math.random() * 6);
  document.getElementById("dice1").innerText = diceFaces[roll];
  document.getElementById("dice1").style.transform = "rotate(360deg)";
  document.getElementById("dice2").classList.add("hidden");
  document.getElementById("result").innerText = `You rolled a ${roll + 1}`;
}

function rollTwoDice() {
  const roll1 = Math.floor(Math.random() * 6);
  const roll2 = Math.floor(Math.random() * 6);

  document.getElementById("dice1").innerText = diceFaces[roll1];
  document.getElementById("dice2").innerText = diceFaces[roll2];

  document.getElementById("dice1").style.transform = `rotate(${360 + Math.random() * 360}deg)`;
  document.getElementById("dice2").style.transform = `rotate(${360 + Math.random() * 360}deg)`;
  document.getElementById("dice2").classList.remove("hidden");

  const total = roll1 + roll2 + 2;
  document.getElementById("result").innerText = `You rolled ${roll1 + 1} and ${roll2 + 1} (Total: ${total})`;
}