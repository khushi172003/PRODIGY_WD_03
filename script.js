// script.js
const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('.reset-btn');
const message = document.querySelector('.message');
const playerXScoreElement = document.getElementById('playerX');
const playerOScoreElement = document.getElementById('playerO');
const currentTurnElement = document.getElementById('currentTurn');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAIEnabled = true;
let playerXScore = 0;
let playerOScore = 0;

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

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    makeMove(clickedCellIndex, currentPlayer);
    handleResultValidation();

    if (gameActive && isAIEnabled) {
        setTimeout(aiMove, 500); // Delay AI move for better user experience
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add('marked');
}

function aiMove() {
    // Simple AI to block player's winning move
    let availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);
    let aiMoveIndex = getBestMove(availableCells);
    makeMove(aiMoveIndex, 'O');
    handleResultValidation();
}

function getBestMove(availableCells) {
    for (let i = 0; i < availableCells.length; i++) {
        let move = availableCells[i];
        board[move] = 'O';
        if (checkWin('O')) {
            board[move] = '';
            return move;
        }
        board[move] = '';
    }
    for (let i = 0; i < availableCells.length; i++) {
        let move = availableCells[i];
        board[move] = 'X';
        if (checkWin('X')) {
            board[move] = '';
            return move;
        }
        board[move] = '';
    }
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function checkWin(player) {
    return winningConditions.some(condition => condition.every(index => board[index] === player));
}

function handleResultValidation() {
    let roundWon = false;
    let winningCondition;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCondition = winCondition;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        highlightWinningCells(winningCondition);
        updateScore(currentPlayer);
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        message.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentTurnElement.textContent = currentPlayer;
}

function highlightWinningCells(winningCondition) {
    winningCondition.forEach(index => {
        cells[index].classList.add('highlight');
    });
}

function updateScore(player) {
    if (player === 'X') {
        playerXScore++;
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
    } else {
        playerOScore++;
        playerOScoreElement.textContent = `Player O: ${playerOScore}`;
    }
}

function handleResetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = '';
    currentTurnElement.textContent = currentPlayer;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('highlight', 'marked');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', handleResetGame);
