
const cells = document.querySelectorAll('.cell');


let board = Array(9).fill(null);
let currentPlayer = 'X';


const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];


function checkWin(board) {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null; 
}


function generateGameTree(board, player) {
    let moves = [];
    
   
    if (checkWin(board) || board.every(cell => cell !== null)) {
        return [];
    }
    
 
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            let newBoard = [...board];
            newBoard[i] = player;
            moves.push({
                move: i,
                board: newBoard
            });
        }
    }
    
    return moves;
}


function displayGameTree(gameTree) {
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = ''; 
    
  
    const rowWrapper = document.createElement('div');
    rowWrapper.style.display = 'flex';
    rowWrapper.style.flexWrap = 'wrap';
    rowWrapper.style.gap = '20px';
    
    gameTree.forEach(move => {
        const moveWrapper = document.createElement('div');
        moveWrapper.style.display = 'flex';
        moveWrapper.style.flexDirection = 'column';
        moveWrapper.style.alignItems = 'center';
        
        const moveLabel = document.createElement('div');
        moveLabel.textContent = `Jogada: ${move.move}`;
        moveLabel.style.marginBottom = '10px';
        moveWrapper.appendChild(moveLabel);

        const moveElement = document.createElement('div');
        moveElement.classList.add('move-container');
        moveElement.appendChild(formatBoardForDisplay(move.board));
        moveWrapper.appendChild(moveElement);

        rowWrapper.appendChild(moveWrapper);
    });

    movesContainer.appendChild(rowWrapper);
}


function formatBoardForDisplay(board) {
    const fragment = document.createDocumentFragment();
    
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('move-cell');
        cell.textContent = value || '-';
        fragment.appendChild(cell);
    });

    return fragment;
}


function handleClick(event) {
    const index = event.target.dataset.index;
    if (!board[index]) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        const winner = checkWin(board);
        if (winner) {
            alert(`${winner} venceu!`);
            resetGame();
        } else if (board.every(cell => cell !== null)) {
            alert('Empate!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateCurrentPlayerDisplay(); 
            const gameTree = generateGameTree(board, currentPlayer);
            displayGameTree(gameTree);
        }
    }
}


function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    updateCurrentPlayerDisplay(); 
    document.getElementById('moves-container').innerHTML = ''; 
}


function updateCurrentPlayerDisplay() {
    document.getElementById('current-player').textContent = `Jogador Atual: ${currentPlayer}`;
}


cells.forEach(cell => cell.addEventListener('click', handleClick));


updateCurrentPlayerDisplay();
