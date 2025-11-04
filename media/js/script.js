const gameBoard = ['', '', '', '', '', '', '', '', ''];
const bulldog = '🐶';  // Player
const bone = '🦴';     // Computer
let currentPlayer = bulldog;
let gameActive = true;
let autoRestartTimeout = null;

const winningConditions = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
];

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

function handleCellClick(e) {
   const index = e.target.getAttribute('data-index');

   if (gameBoard[index] !== '' || !gameActive || currentPlayer !== bulldog) {
      return;
   }

   makeMove(index, bulldog);

   if (!gameActive) return;

   currentPlayer = bone;
   message.textContent = "Computer's turn!";
   setTimeout(computerMove, 700);
}

function makeMove(index, player) {
   gameBoard[index] = player;
   cells[index].textContent = player;

   if (checkWin()) {
      message.textContent = `${player === bulldog ? 'You ' : 'Computer '} won! 🎉`;
      gameActive = false;
      scheduleRestart();
      return;
   }

   if (isDraw()) {
      message.textContent = "It's a draw!";
      gameActive = false;
      scheduleRestart();
      return;
   }

   currentPlayer = player === bulldog ? bone : bulldog;
   if (gameActive) {
      message.textContent = currentPlayer === bulldog ? "Your turn!" : "Computer's turn!";
   }
}

function computerMove() {
   if (!gameActive) return;

   const availableIndices = gameBoard
      .map((val, idx) => val === '' ? idx : null)
      .filter(val => val !== null);

   if (availableIndices.length === 0) return;

   const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
   makeMove(randomIndex, bone);
}

function checkWin() {
   return winningConditions.some(condition => {
      const [a, b, c] = condition;
      return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
   });
}

function isDraw() {
   return gameBoard.every(cell => cell !== '');
}

function resetGame() {
   clearTimeout(autoRestartTimeout);
   for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = '';
      cells[i].textContent = '';
   }
   currentPlayer = bulldog;
   gameActive = true;
   message.textContent = `Your turn!`;
}

function scheduleRestart() {
   autoRestartTimeout = setTimeout(() => {
      resetGame();
   }, 2000);
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
