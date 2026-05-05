import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      type="button"
      className={props.format}
      onClick={props.onClick}
      aria-label={props.value ? `Square ${props.index + 1}: ${props.value}` : `Square ${props.index + 1}: empty`}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        index={i}
        value={this.props.squares[i]}
        format={this.props.formats[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = []
    for (let index = 0; index < 9; index++) {
      squares.push(this.renderSquare(index))
    }
    return (
      <div className="board-grid" role="grid" aria-label="Tic tac toe board">{squares}</div>
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
    const isDraw = checkDraw(current.squares);
    const isRunning = this.isStarted();

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
        <li key={move} className="history-item">
          <button type="button" className={stepFormat} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let playerStatus;
    if (this.state.xIsPlayer) {
      playerStatus = 'X';
    } else {
      playerStatus = 'O';
    }
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
      this.endGame();
    } else if (isDraw) {
      status = 'Draw';
      this.endGame();
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let statusTone = 'status-banner';
    if (winner) {
      statusTone += ' status-banner-win';
    } else if (isDraw) {
      statusTone += ' status-banner-draw';
    }

    return (
      <main className="game-shell">
        <section className="hero-panel">
          <p className="eyebrow">Arcade Arena</p>
          <h1>Tic Tac Toe</h1>
          <p className="hero-copy">Challenge the computer in a brighter retro-inspired board with clearer controls, live match status, and fast rematches.</p>
          <div className="summary-strip" aria-label="Current game setup">
            <div className="summary-chip">
              <span className="summary-label">You play</span>
              <strong>{playerStatus}</strong>
            </div>
            <div className="summary-chip">
              <span className="summary-label">First turn</span>
              <strong>{this.state.xIsFirstSet ? 'X' : 'O'}</strong>
            </div>
            <div className="summary-chip">
              <span className="summary-label">Match state</span>
              <strong>{isRunning ? 'Live' : 'Idle'}</strong>
            </div>
          </div>
        </section>

        <section className="game-layout">
          <aside className="panel control-panel">
            <div className="panel-heading">
              <p className="panel-kicker">Setup</p>
              <h2>Game Settings</h2>
            </div>

            <fieldset className="control-group" disabled={isRunning}>
              <legend>You are</legend>
              <label className="choice-pill" htmlFor="play-as-o">
                <input
                  id="play-as-o"
                  type="radio"
                  value="0"
                  name="xIsPlayer"
                  checked={!this.state.xIsPlayerSet}
                  onChange={this.setPlayer.bind(this)}
                />
                <span>O</span>
              </label>
              <label className="choice-pill" htmlFor="play-as-x">
                <input
                  id="play-as-x"
                  type="radio"
                  value="1"
                  name="xIsPlayer"
                  checked={this.state.xIsPlayerSet}
                  onChange={this.setPlayer.bind(this)}
                />
                <span>X</span>
              </label>
            </fieldset>

            <fieldset className="control-group" disabled={isRunning}>
              <legend>Start first</legend>
              <label className="choice-pill" htmlFor="start-as-o">
                <input
                  id="start-as-o"
                  type="radio"
                  value="0"
                  name="xIsFirst"
                  checked={!this.state.xIsFirstSet}
                  onChange={this.setFirst.bind(this)}
                />
                <span>O</span>
              </label>
              <label className="choice-pill" htmlFor="start-as-x">
                <input
                  id="start-as-x"
                  type="radio"
                  value="1"
                  name="xIsFirst"
                  checked={this.state.xIsFirstSet}
                  onChange={this.setFirst.bind(this)}
                />
                <span>X</span>
              </label>
            </fieldset>

            <div className="panel-heading panel-heading-compact">
              <p className="panel-kicker">Controls</p>
              <h2>Match Flow</h2>
            </div>
            <div className="action-row">
              <button type="button" className="action-button action-button-primary" onClick={() => this.startGame()} disabled={isRunning}>Start</button>
              <button type="button" className="action-button action-button-secondary" onClick={() => this.endGame()} disabled={!isRunning}>End</button>
            </div>
          </aside>

          <section className="board-column">
            <div className={statusTone} aria-live="polite">{status}</div>
            <div className="board-frame">
              <Board squares={current.squares} formats={formats} onClick={(i) => this.handleManualClick(i)} />
            </div>
          </section>

          <aside className="panel history-panel">
            <div className="panel-heading">
              <p className="panel-kicker">Timeline</p>
              <h2>Move History</h2>
            </div>
            <p className="history-copy">Jump to any turn to replay the match and inspect how the board changed.</p>
            <ol className="history-list">{moves}</ol>
          </aside>
        </section>
      </main>
    );
  }
}

// ========================================

const root = createRoot(document.getElementById('root'));
root.render(<Game />);

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
    let maxValue = -99999
    for (let index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        let tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        let possibleList = minimax(maxPlayer, otherPlayer, tempSquares)
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
    let minValue = 99999
    for (let index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        let tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        let possibleList = minimax(maxPlayer, otherPlayer, tempSquares)
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
  let otherPlayer = (currPlayer === 'X') ? 'O' : 'X';
  let winner = calculateWinner(squares);
  if (winner === maxPlayer) {
    return [[1, -1]];
  } else if (winner !== null) {
    return [[-1, -1]];
  } else if (checkDraw(squares)) {
    return [[0, -1]];
  }

  let list = [];
  if (maxPlayer === currPlayer) {
    let maxValue = -99999
    for (let index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        let tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        let possibleList = alphabetaPrunning(maxPlayer, otherPlayer, alpha, beta, tempSquares)
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
    let minValue = 99999
    for (let index = 0; index < squares.length; index++) {
      if (squares[index] === null) {
        let tempSquares = squares.slice();
        tempSquares[index] = currPlayer
        let possibleList = alphabetaPrunning(maxPlayer, otherPlayer, alpha, beta, tempSquares)
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