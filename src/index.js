import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";
import yahooFinance from "yahoo-finance";

class Square extends React.Component {
  render() {
    return <button className="square">{/* TODO */}</button>;
  }
}
// https://api.nasdaq.com/api/quote/SPY/historical?assetclass=etf&fromdate=1990-01-01&limit=9999&todate=2022-01-30

class Board extends React.Component {
  componentDidMount() {
    console.log("oops");
  }

  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = "Next player: X";

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
