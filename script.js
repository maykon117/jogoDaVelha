// Seleciona todas as células do tabuleiro
const cells = document.querySelectorAll('.cell');

// Inicializa o tabuleiro e o jogador atual
let board = Array(9).fill(null);
let currentPlayer = 'X';

// Define as combinações vencedoras possíveis
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// Função para verificar se há um vencedor
function checkWin(board) {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Retorna o jogador vencedor ('X' ou 'O')
        }
    }
    return null; // Nenhum vencedor
}

// Função para gerar a árvore de jogo
function generateGameTree(board, player) {
    let moves = [];
    
    // Verifica se alguém venceu ou se deu empate
    if (checkWin(board) || board.every(cell => cell !== null)) {
        return [];
    }
    
    // Gera todas as possíveis jogadas
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

// Função para exibir as jogadas no container
function displayGameTree(gameTree) {
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = ''; // Limpa as jogadas anteriores
    
    // Cria um contêiner para armazenar as jogadas lado a lado
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

// Função auxiliar para formatar o tabuleiro para exibição
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

// Função para processar clique nas células
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
            updateCurrentPlayerDisplay(); // Atualiza o jogador atual
            const gameTree = generateGameTree(board, currentPlayer);
            displayGameTree(gameTree);
        }
    }
}

// Função para resetar o jogo
function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    updateCurrentPlayerDisplay(); // Atualiza o jogador atual
    document.getElementById('moves-container').innerHTML = ''; // Limpa as jogadas anteriores
}

// Função para atualizar o display do jogador atual
function updateCurrentPlayerDisplay() {
    document.getElementById('current-player').textContent = `Jogador Atual: ${currentPlayer}`;
}

// Adiciona eventos de clique às células
cells.forEach(cell => cell.addEventListener('click', handleClick));

// Atualiza o jogo inicial para mostrar o jogador atual
updateCurrentPlayerDisplay();
