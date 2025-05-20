'use strict';

export default class Game {
  constructor(initialState) {
    this.gameBoard = initialState || this.createEmptyBoard();
    this.gameScore = 0;
    this.gameStatus = 'idle';
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.gameBoard[r].filter((val) => val !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          this.gameScore += row[c];
          row[c + 1] = 0;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      if (!this.arraysEqual(this.gameBoard[r], row)) {
        moved = true;
        this.gameBoard[r] = row;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.gameBoard[r].filter((val) => val !== 0);

      for (let c = row.length - 1; c > 0; c--) {
        if (row[c] === row[c - 1]) {
          row[c] *= 2;
          this.gameScore += row[c];
          row[c - 1] = 0;
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }

      if (!this.arraysEqual(this.gameBoard[r], row)) {
        moved = true;
        this.gameBoard[r] = row;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let col = [];

      for (let r = 0; r < 4; r++) {
        if (this.gameBoard[r][c] !== 0) {
          col.push(this.gameBoard[r][c]);
        }
      }

      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          this.gameScore += col[i];
          col[i + 1] = 0;
        }
      }

      col = col.filter((val) => val !== 0);

      while (col.length < 4) {
        col.push(0);
      }

      for (let r = 0; r < 4; r++) {
        if (this.gameBoard[r][c] !== col[r]) {
          moved = true;
          this.gameBoard[r][c] = col[r];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let col = [];

      for (let r = 3; r >= 0; r--) {
        if (this.gameBoard[r][c] !== 0) {
          col.push(this.gameBoard[r][c]);
        }
      }

      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          this.gameScore += col[i];
          col[i + 1] = 0;
        }
      }

      col = col.filter((val) => val !== 0);

      while (col.length < 4) {
        col.unshift(0);
      }

      for (let r = 3, i = 3; r >= 0; r--, i--) {
        if (this.gameBoard[r][c] !== col[i]) {
          moved = true;
          this.gameBoard[r][c] = col[i];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameBoard[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];

    this.gameBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  getScore() {
    return this.gameScore;
  }

  getState() {
    return this.gameBoard;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.gameBoard = this.createEmptyBoard();
    this.gameStatus = 'playing';
    this.gameScore = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
    this.gameStatus = 'idle';
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameBoard[r][c] === 0) {
          return false;
        }

        if (
          (r < 3 && this.gameBoard[r][c] === this.gameBoard[r + 1][c]) ||
          (c < 3 && this.gameBoard[r][c] === this.gameBoard[r][c + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
