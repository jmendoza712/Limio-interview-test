import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={props.bgColor}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                bgColor={ {backgroundColor: this.props.bgColor[i]} }
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    background: Array(9).fill('white')
                }
            ],
            players: {
              X: '',
              O: '',
            },
            score: {
              X: 0,
              O: 0,
            },
            stepNumber: 0,
            xIsNext: true,
        };
        this.playerXNameChange = this.playerXNameChange.bind(this);
        this.playerONameChange = this.playerONameChange.bind(this);
    }

    // Events handler logic (if for the board; else for buttons)
    handleClick(i) {
      if (typeof i === "number") {
          console.log('Event is a number');

          this.clickOnBoard(i);
      } else {
          console.log('Event is an object');

          switch (i.target.className) {
            case 'start-button':
              this.clickOnStart(i);
              break;

            case 'start-again-button':
              this.clickOnStartAgain();
              break;

            case 'reset-button':
              this.clickOnReset();
              break;

            default:
              break;
          }
      }
    }

    clickOnBoard(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const background = current.background.slice();
      const score = this.state.score;

      if (squares[i] || calculateWinner(squares)) {
        return;
      }

      squares[i] = this.state.xIsNext ? "X" : "O";

      // Changing background colour of winning combination
      // and the game's score
      const winner = calculateWinner(squares)
      if (winner) {
        for (let i = 0; i < winner.combination.length; i++) {
          background[winner.combination[i]] = 'yellow';
        }
        winner.player === 'X' ? score.X++ : score.O++;
      }

      this.setState({
          history: history.concat([
              {
                  squares: squares,
                  background: background
              }
          ]),
          score: {
            X: score.X,
            O: score.O,
          },
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      });
    }

    clickOnStart(i) {
        const htmlStartButtonTag = document.querySelector('.start-button');
        // const htmlStartAgainButtonTag = document.querySelector('.start-again-button');

        // htmlStartButtonTag.innerHTML = 'Start again';
        // htmlStartButtonTag.className = 'Start-again-button';
        htmlStartButtonTag.disabled = 'true';
        // htmlStartAgainButtonTag.removeAttribute('disabled');

        const htmlGameTag = document.querySelector('.game');
        htmlGameTag.style.display = 'flex';

        const htmlInput = document.querySelectorAll('.player-name');
        for (let i = 0; i < htmlInput.length; i++) {
          htmlInput[i].disabled = 'true';
        }
    }

    clickOnStartAgain() {
      console.log(document.querySelector('.start-again-button'));
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null),
                    background: Array(9).fill('white')
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            gameStarted: false,
        });
    }

    clickOnReset() {
      window.location.reload(true);
    }

    playerXNameChange(event) {
      const players = this.state.players;
      this.setState({
          players:
            {
              X: event.target.value,
              O: players.O
            }
      })
    }

    playerONameChange(event) {
      const players = this.state.players;
      this.setState({
          players:
            {
              X: players.X,
              O: event.target.value
            }
      })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const players = this.state.players
        const score = this.state.score;
        // console.log('rendering this.state')
        // console.log(this.state)
        // const background = this.state.background.slice();
        // console.log(this.state.background)
        // console.log(history)


        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + players[winner.player];
        } else {
            status = "Next player: " + (this.state.xIsNext ? players.X : players.O);
            // status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className='container'>
                <div className='scoringboard'>
                    <div className='player-x'>
                        <label>Player X:</label>
                        <input className="player-name" name='X' value={players.X} onChange={e => this.playerXNameChange(e)}/>
                        <div>Games won: {score.X}</div>
                    </div>
                    <div className='player-o'>
                        <label>Player O:</label>
                        <input className="player-name" name='O' value={players.O} onChange={e => this.playerONameChange(e)}/>
                        <div>Games won: {score.O}</div>
                    </div>
                </div>
                <div className='game-control'>
                    <button className='start-button' onClick={e => this.handleClick(e)}>
                      Start
                    </button>
                    <button className='start-again-button' onClick={e => this.handleClick(e)}>
                      Start again
                    </button>
                    <button className='reset-button' onClick={e => this.handleClick(e)}>
                      Reset
                    </button>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={i => this.handleClick(i)}
                            bgColor={current.background}
                            // bgColor={this.state.background}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // return squares[a];
            return {
              player: squares[a],
              combination: lines[i],
            };
        }
    }
    return null;
}
