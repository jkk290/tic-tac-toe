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
  
    return { getBoard, placeMark, printBoard };
  })();

  
  const game = (function(playerOneName = "Player One", playerTwoName = "Player Two") {
  
    const players = [
      {
        name: playerOneName,
        mark: 1
      },
      {
        name: playerTwoName,
        mark: 2
      }
    ];
  
    let activePlayer = players[0];    
    let currentRound = 1;
    
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      Gameboard.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };

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
        printNewRound();
        return;
      };

      if (checkWin(Gameboard.getBoard(), currentPlayerMark)) {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name} wins on round ${currentRound}!`);
        return;
      };

      if (currentRound === 9) {
        Gameboard.printBoard();
        console.log("It's a draw!");
        return;
      };    

      currentRound++;
      switchPlayerTurn();
      printNewRound();
    };
  
    printNewRound();
  
    return {
      playRound
    };
  })();