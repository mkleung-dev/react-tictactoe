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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      formats: Array(9).fill('square'),
      stepNumber: 0,
      xIsNext: false,
    };
    setInterval(() => {
      if (!this.state.xIsNext) {
        //var list = alphabetaPrunning('0', '0',  -99999, 99999, this.state.history[this.state.stepNumber].squares);
        var list = minimax('0', '0',  this.state.history[this.state.stepNumber].squares);
        var index = Math.floor(Math.random() * list.length);
        this.handleClick(list[index][1]);
      }
    }, 100);
  }

  handleManualClick(i) {
    if (this.state.xIsNext) {
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
    squares[i] = this.state.xIsNext ? 'X' : '0';
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
    this.setState({
      formats: highlightWinner(this.state.history[step].squares),
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const formats = this.state.formats;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((_step, move) => {
      const stepFormat = move === this.state.stepNumber ? 'currStep' : 'nonCurrStep'
      const desc = move ?
        'Go to move #' + move + ' (' + history[move].motion % 3 + ',' + parseInt(history[move].motion / 3, 10) + ')':
        'Go to game start';
      return (
          <li key={move}>
            <button className={stepFormat} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
    });

    let moveHistory = []
    moveHistory.push(<ol>{moves}</ol>)

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (checkDraw(current.squares)) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} formats={formats} onClick={(i) => this.handleManualClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {moveHistory}
        </div>
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

function minimax(maxPlayer, currPlayer, squares) {
  var otherPlayer = (currPlayer === 'X') ? '0' : 'X';
  var winner = calculateWinner(squares);
  if (winner === maxPlayer) {
    return [[1, -1]];
  } else if (checkDraw(squares)) {
    return [[0, -1]];
  } else if (winner !== null) {
    return [[-1, -1]];
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
  }
  return list;
}

function alphabetaPrunning(maxPlayer, currPlayer, alpha, beta, squares) {
  var otherPlayer = (currPlayer === 'X') ? '0' : 'X';
  var winner = calculateWinner(squares);
  if (winner === maxPlayer) {
    return [[1, -1]];
  } else if (checkDraw(squares)) {
    return [[0, -1]];
  } else if (winner !== null) {
    return [[-1, -1]];
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