// set game board
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // get board from html
  const htmlBoard = document.getElementById('board');

  // create column buttons to drop the pieces
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create board cells
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    board.push([])
    for (let x = 0; x < WIDTH; x++) {
      board[y].push(null);
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  //return x
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const div = document.createElement("div");
  div.classList.add('piece', `player-${currPlayer}`);
  document.getElementById(`${y}-${x}`).append(div);
  board[y][x] = currPlayer;
}

/** endGame: announce game end or tie */
const endGame = msg => {
  document.getElementById("column-top").removeEventListener("click", handleClick)
  setTimeout(() => {
    alert(msg);
    window.location.reload();
  }, 1000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === undefined) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win or tie
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  } else if (checkForTie()) {
    return endGame('Its a tie!')
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2: currPlayer = 1
}

// check if all cells are filled
const checkForTie = () => board.every(val => !val.includes(null));

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
// function to restart the game
const restartGame = () => window.location.reload();

makeHtmlBoard();
