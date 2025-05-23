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

  updateGameStatus() {
    if (this.gameBoard.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (this.isGameOver()) {
      this.gameStatus = 'lose';
    }
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const originalRow = [...this.gameBoard[r]];

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

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
        this.gameBoard[r] = row;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const originalRow = [...this.gameBoard[r]];

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

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
        this.gameBoard[r] = row;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const originalCol = this.gameBoard.map((row) => row[c]);

      let col = originalCol.filter((val) => val !== 0);

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

      if (!this.arraysEqual(originalCol, col)) {
        moved = true;

        for (let r = 0; r < 4; r++) {
          this.gameBoard[r][c] = col[r];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const originalCol = this.gameBoard.map((row) => row[c]);

      let col = originalCol.filter((val) => val !== 0).reverse();

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

      col = col.reverse();

      if (!this.arraysEqual(originalCol, col)) {
        moved = true;

        for (let r = 0; r < 4; r++) {
          this.gameBoard[r][c] = col[r];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateGameStatus();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameBoard[r][c] === 0) {
          empty.push({ rr: r, cc: c });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { rr, cc } = empty[Math.floor(Math.random() * empty.length)];

    this.gameBoard[rr][cc] = Math.random() < 0.9 ? 2 : 4;
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
