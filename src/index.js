import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.format} onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]} format={this.props.formats[i]} onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    let table = []
    for (let row = 0; row < 3; row++) {
      let rowItem = []
      for (let col = 0; col < 3; col++) {
        rowItem.push(this.renderSquare(row * 3 + col))
      }
      table.push(<div className="board-row">{rowItem}</div>)
    }
    return (
      <div>{table}</div>
    );
  }
}

function YouAre(props) {
  return (
    <button className={props.format} onClick={props.onClick} >
      {props.value}
    </button>
  );
}

function StartFirst(props) {
  return (
    <button className={props.format} onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      formats: Array(9).fill('square'),
      stepNumber: 0,
      xIsNext: true,
      xIsPlayer: false,
      xIsFirstSet: false,
      xIsPlayerSet: false,
      intervalTimer: null
    };
  }

  setPlayer(event) {
    this.setState({
      xIsPlayerSet: event.target.value === '1'
    });
  }
  setFirst(event) {
    this.setState({
      xIsFirstSet: event.target.value === '1'
    });
  }


  isStarted() {
    return (null !== this.state.intervalTimer);
  }

  startGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      formats: Array(9).fill('square'),
      stepNumber: 0,
      xIsNext: this.state.xIsFirstSet,
      xIsPlayer: this.state.xIsPlayerSet
    });

    if (!this.state.intervalTimer) {
      this.setState({
        intervalTimer: setInterval(() => {
          if ((!this.state.xIsNext && this.state.xIsPlayer) || (this.state.xIsNext && !this.state.xIsPlayer)) {
            var p = this.state.xIsPlayer ? 'O' : 'X';
            //var list = alphabetaPrunning(p, p,  -99999, 99999, this.state.history[this.state.stepNumber].squares);
            var list = minimax(p, p,  this.state.history[this.state.stepNumber].squares);
            var index = Math.floor(Math.random() * list.length);
            this.handleClick(list[index][1]);
          }
        }, 100)
      });
    }
  }

  endGame() {
    if (null !== this.state.intervalTimer) {
      clearInterval(this.state.intervalTimer);
      this.setState({
        intervalTimer: null
      });
    }
  }

  handleManualClick(i) {
    if ((this.state.xIsNext && this.state.xIsPlayer) || (!this.state.xIsNext && !this.state.xIsPlayer)) {
      this.handleClick(i)
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        motion: i
      }]),
      formats: highlightWinner(squares),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    if ((step - this.state.stepNumber) % 2 === 0) {
    } else {
      this.setState({
        xIsNext: !this.state.xIsNext,
      });

    }
    this.setState({
      formats: highlightWinner(this.state.history[step].squares),
      stepNumber: step
    });
  }

  render() {
    const formats = this.state.formats;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const xIsFirst = this.state.xIsFirstSet;
    const moves = history.map((_step, move) => {
      var first = 'O';
      if (xIsFirst && (move % 2 === 1)) {
        first = 'X';
      }
      if (!xIsFirst && (move % 2 === 0)) {
        first = 'X';
      }
      const stepFormat = move === this.state.stepNumber ? 'currStep' : 'nonCurrStep'
      const desc = move ?
        'Go to move ' + move + ' ' + first + ' (' + history[move].motion % 3 + ',' + parseInt(history[move].motion / 3, 10) + ')':
        'Go to game start';
      return (
          <li key={move}>
            <button className={stepFormat} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });

    let moveHistory = []
    moveHistory.push(<ol>{moves}</ol>)

    let playerStatus;
    if (this.state.xIsPlayer) {
      playerStatus = 'Player: X';
    } else {
      playerStatus = 'Player: O';
    }
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      this.endGame();
    } else if (checkDraw(current.squares)) {
      status = 'Draw';
      this.endGame();
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <table>
          <tbody>
            <tr><th>Tic Tac Toe</th></tr>
            <tr><td>
              <div className="game-controller">
              <div onChange={this.setPlayer.bind(this)}>
                You are:
                <input type="radio" value="0" name="xIsPlayer" checked={!this.state.xIsPlayerSet} disabled={this.isStarted()}/> O
                <input type="radio" value="1" name="xIsPlayer" checked={this.state.xIsPlayerSet} disabled={this.isStarted()}/> X
              </div>
              <div onChange={this.setFirst.bind(this)}>
                Start first:
                <input type="radio" value="0" name="xIsFirst" checked={!this.state.xIsFirstSet} disabled={this.isStarted()}/> O
                <input type="radio" value="1" name="xIsFirst" checked={this.state.xIsFirstSet} disabled={this.isStarted()}/> X
              </div>

              <button className="game-start" onClick={() => this.startGame()} disabled={this.isStarted()}>Start</button>
              <button className="game-start" onClick={() => this.endGame()} disabled={!this.isStarted()}>End</button>
              </div>
            </td></tr>
            <tr><td>
              <div className="game-board">
                <Board squares={current.squares} formats={formats} onClick={(i) => this.handleManualClick(i)} />
              </div>
            </td></tr>
            <tr><td>
              <div className="game-info">
                <div>{playerStatus}</div>
                <div>{status}</div>
                History:
                {moveHistory}
              </div>
            </td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function printBoard(squares) {
  var boardString = ""
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      boardString = boardString + " ";
    } else {
      boardString = boardString + squares[i];
    }
    if (i % 3 === 2) {
      boardString = boardString + "\n";
    }
  }
}

function minimax(maxPlayer, currPlayer, squares) {
  var otherPlayer = (currPlayer === 'X') ? 'O' : 'X';
  var winner = calculateWinner(squares);
  if (winner === maxPlayer) {
    return [[1, -1]];
  } else if (winner !== null) {
    return [[-1, -1]];
  } else if (checkDraw(squares)) {
    return [[0, -1]];
  }

  var list = [];
  if (maxPlayer === currPlayer) {
    var maxValue = -99999
    for (var index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        var tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        var possibleList = minimax(maxPlayer, otherPlayer, tempSquares)
        if (possibleList[0][0] > maxValue) {
          list = []
          maxValue = possibleList[0][0]
          list.push([maxValue, index])
        } else if (possibleList[0][0] === maxValue) {
          list.push([maxValue, index])
        }
      }
    }
    //console.log("maximax," + maxValue);
  } else {
    var minValue = 99999
    for (var index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        var tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        var possibleList = minimax(maxPlayer, otherPlayer, tempSquares)
        if (possibleList[0][0] < minValue) {
          list = []
          minValue = possibleList[0][0]
          list.push([minValue, index])
        } else if (possibleList[0][0] === minValue) {
          list.push([minValue, index])
        }
      }
    }
    //console.log("minimax," + minValue);
  }
  return list;
}

function alphabetaPrunning(maxPlayer, currPlayer, alpha, beta, squares) {
  var otherPlayer = (currPlayer === 'X') ? 'O' : 'X';
  var winner = calculateWinner(squares);
  if (winner === maxPlayer) {
    return [[1, -1]];
  } else if (winner !== null) {
    return [[-1, -1]];
  } else if (checkDraw(squares)) {
    return [[0, -1]];
  }

  var list = [];
  if (maxPlayer === currPlayer) {
    var maxValue = -99999
    for (var index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        var tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        var possibleList = alphabetaPrunning(maxPlayer, otherPlayer, alpha, beta, tempSquares)
        if (possibleList[0][0] > maxValue) {
          list = []
          maxValue = possibleList[0][0]
          list.push([maxValue, index])
        } else if (possibleList[0][0] === maxValue) {
          list.push([maxValue, index])
        }
        if (maxValue > alpha) {
          alpha = maxValue
        }
        if (alpha >= beta) {
          break;
        }
      }
    }
  } else {
    var minValue = 99999
    for (var index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        var tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        var possibleList = alphabetaPrunning(maxPlayer, otherPlayer, alpha, beta, tempSquares)
        if (possibleList[0][0] < minValue) {
          list = []
          minValue = possibleList[0][0]
          list.push([minValue, index])
        } else if (possibleList[0][0] === minValue) {
          list.push([minValue, index])
        }
        if (minValue < beta) {
          beta = minValue
        }
        if (alpha >= beta) {
          break;
        }
      }
    }
  }
  return list;
}

function highlightWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  var formats = [
    'square', 'square', 'square',
    'square', 'square', 'square',
    'square', 'square', 'square'
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      formats[a] = 'squareHighlighted'
      formats[b] = 'squareHighlighted'
      formats[c] = 'squareHighlighted'
    }
  }
  return formats;
}

function checkDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return false;
    }
  }
  return true
}