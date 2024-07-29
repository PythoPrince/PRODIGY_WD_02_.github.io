const gameBoard = document.getElementById('game-board');
const cells = Array.from(document.querySelectorAll('.cell'));
const resetButton = document.getElementById('reset-button');
const modeButton = document.getElementById('mode-button');
const messageElement = document.getElementById('message');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreDrawElement = document.getElementById('score-draw');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isAiMode = false;
let scores = { X: 0, O: 0, draw: 0 };
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const moveSound = new Audio('sounds/move.mp3');
const winSound = new Audio('sounds/win.mp3');
const drawSound = new Audio('sounds/draw.mp3');

function handleClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== '' || checkWinner()) {
        return;
    }

    makeMove(index, currentPlayer);
    moveSound.play();

    if (checkWinner()) {
        scores[currentPlayer]++;
        updateScores();
        messageElement.textContent = `${currentPlayer} wins!`;
        winSound.play();
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        scores.draw++;
        updateScores();
        messageElement.textContent = `It's a draw!`;
        drawSound.play();
        return;
    }

    if (isAiMode && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(makeAiMove, 500); // Delay AI move for better UX
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
}

function makeAiMove() {
    let availableIndices = gameState
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    if (availableIndices.length === 0 || checkWinner()) {
        return;
    }

    let randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    makeMove(randomIndex, 'O');
    moveSound.play();

    if (checkWinner()) {
        scores['O']++;
        updateScores();
        messageElement.textContent = `O wins!`;
        winSound.play();
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        scores.draw++;
        updateScores();
        messageElement.textContent = `It's a draw!`;
        drawSound.play();
        return;
    }

    currentPlayer = 'X';
}

function checkWinner() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function updateScores() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.draw;
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    messageElement.textContent = '';
}

function switchMode() {
    isAiMode = !isAiMode;
    modeButton.textContent = isAiMode ? 'Switch to Human Mode' : 'Switch to AI Mode';
    resetGame();
}

gameBoard.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
modeButton.addEventListener('click', switchMode);
