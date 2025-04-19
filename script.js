function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;
  
    const placeMark = (row,column, player) => {

    //   const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
    //   if (!availableCells.length) return;
  
      board[row][column].addMark(player);
    };

    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    return { getBoard, placeMark, printBoard };
  }
  
  
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
  
  
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
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
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row, column) => {
      
      console.log(
        `Placing ${getActivePlayer().name}'s mark into position row: ${row} column: ${column}...`
      );
      board.placeMark(row, column, getActivePlayer().mark);

      switchPlayerTurn();
      printNewRound();
    };
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer
    };
  }
  
  const game = GameController();