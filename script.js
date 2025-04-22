const Gameboard = (function() {
  const rows = 3;
  const columns = 3;
  const board = [];

  function Cell() {
    let value = 0;
    
    const addMark = (player) => {
      value = player;
    };  
  
    const getValue = () => value;
    
    return {
      addMark,
      getValue
    };
  }    
  
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  
  const getBoard = () => {
    return board;
  };
  
  const placeMark = (row, column, player) => {
    const cell = board[row][column];
    const availableCell = board[row][column].getValue() === 0;

    if (!availableCell) {
      console.log(`Position ${row}, ${column} is already taken`);
      return true;
    }

    cell.addMark(player);
    return false;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  function resetBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };
  
  return { 
    getBoard, 
    placeMark, 
    printBoard,
    resetBoard 
  };
})();

  
const game = (function() {
  
  let playersContainer = document.querySelector('#player-container');
  let addPlayerForm = document.querySelector('#add-player-form');
  const players = [];

  let activePlayer;
  let currentRound;

  addPlayerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let playerOneName = document.getElementById("playerOneName").value;
    let playerTwoName = document.getElementById("playerTwoName").value;

    players.push(
      {
        name: playerOneName,
        mark: 1
      },
      {
        name: playerTwoName,
        mark: 2
      }
    );

    initializeGame();
    addPlayerForm.style.display = "none";
    Display.updateDisplay();

  });

  function initializeGame()  {
    activePlayer = players[0];
    currentRound = 1;
  };
      
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  function checkRows(board, playerMark) {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0].getValue() === playerMark &&
        board[i][1].getValue() === playerMark &&
        board[i][2].getValue() === playerMark
      ) {
        return true;
      }
    }
    return false;
  };

  function checkColumns(board, playerMark) {
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j].getValue() === playerMark &&
        board[1][j].getValue() === playerMark &&
        board[2][j].getValue() === playerMark
      ) {
        return true;
      }
    }
    return false;
  };

  function checkDiagonals(board, playerMark) {
    if ((
      board[0][0].getValue() === playerMark && 
      board[1][1].getValue() === playerMark && 
      board[2][2].getValue() === playerMark
    ) || (
      board[0][2].getValue() === playerMark &&
      board[1][1].getValue() === playerMark &&
      board[2][0].getValue() === playerMark 
    )){
      return true;
    }
    return false;
  };

  function checkWin(board, playerMark) {
    if (
      checkRows(board, playerMark) || 
      checkColumns(board, playerMark) ||
      checkDiagonals(board, playerMark)
    ) {        
      return true;
    } else {
      return false;
    }
  };
    
  const playRound = (row, column) => {
    const currentPlayerMark = getActivePlayer().mark;

    console.log(
      `Placing ${getActivePlayer().name}'s mark into position row: ${row} column: ${column}...`
    );

    const wasMoveInvalid = Gameboard.placeMark(row, column, currentPlayerMark);

    if (wasMoveInvalid) {
      console.log("Invalid move! Try again.");
      return { status: 'invalid' };
    };

    if (checkWin(Gameboard.getBoard(), currentPlayerMark)) {
      Gameboard.printBoard();
      console.log(`${getActivePlayer().name} wins on round ${currentRound}!`);
      return { status: 'win', winner: getActivePlayer() };
    };

    if (currentRound === 9) {
      Gameboard.printBoard();
      console.log("It's a draw!");
      return { status: 'draw'};
    };    

    currentRound++;
    switchPlayerTurn();
    return { status: 'continue' };
  };
  
  return {
    playRound,
    getActivePlayer
  };

})();

const Display = (function() {
  const messageText = document.querySelector('#message-text');
  const boardDiv = document.querySelector('#board');
  const resetButton = document.querySelector('#reset-button');
  let gameOver = false;

  const updateDisplay = () => {

    boardDiv.textContent = "";

    if (gameOver === true) {
      console.log(`attempting to show reset button`)
      resetButton.style.display = 'block'
    }

    const board = Gameboard.getBoard();
    const currentPlayer = game.getActivePlayer().name;

    if (gameOver === false) {
      messageText.textContent = `${currentPlayer}'s turn...`
    };

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        if (cell.getValue() === 1) {
          cellButton.textContent = 'X';
          boardDiv.appendChild(cellButton);
        } else if (cell.getValue() === 2) {
          cellButton.textContent = 'O';
          boardDiv.appendChild(cellButton);
        } else {
          cellButton.textContent = '';
          boardDiv.appendChild(cellButton);
        }
      })
    })
  };


  function clickHandlerBoard(e) {
    if (gameOver) return;

    const selectedRow = e.target.dataset.row
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow && !selectedColumn) return;

    const roundOutcome = game.playRound(selectedRow, selectedColumn);
    checkGameStatus(roundOutcome);

  };  
  
  boardDiv.addEventListener('click', clickHandlerBoard);

  function clickHandlerReset(e) {

  };


  function checkGameStatus(roundOutcome) {
    if (roundOutcome.status === 'win') {
      messageText.textContent = `Congratulations! ${roundOutcome.winner.name} wins!`;
      gameOver = true;      
      updateDisplay();
      return;
    } else if (roundOutcome.status === 'draw') {
      messageText.textContent = `It's a draw.`;
      gameOver = true;
      updateDisplay();
      return;
    } else if (roundOutcome.status === 'invalid') {
      messageText.textContent = `Invalid move! Try again.`;
      return;
    } else {
      console.log('continuing');
      updateDisplay();
      return;
    }
  };

  return {
    updateDisplay
  };

})();

