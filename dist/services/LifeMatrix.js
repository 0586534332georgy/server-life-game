"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeMatrix = void 0;
class LifeMatrix {
    constructor(_dwellers, generation = 0) {
        this._dwellers = _dwellers;
        this.generation = generation;
        this.alives = 0;
    }
    get dwellers() {
        return this._dwellers;
    }
    nextGeneration() {
        this.alives = 0;
        this._dwellers = this._dwellers.map((__, i) => this.getNewRow(i));
        return { dwellers: this._dwellers, generation: ++this.generation, alives: this.alives };
    }
    getNewRow(i) {
        return this._dwellers[i].map((__, j) => this.getNewCell(i, j));
    }
    getNewCell(i, j) {
        const matrixArea = this.getMatrixArea(i, j);
        const currentReduce = matrixArea.reduce((res, row) => res + row.reduce((sum, cell) => sum + cell), 0);
        const currentCell = this._dwellers[i][j] ? isAliveFromAlive(currentReduce)
            : isAliveFromDead(currentReduce);
        this.alives += currentCell;
        return currentCell;
    }
    getMatrixArea(i, j) {
        const sliceLeft = j == 0 ? 0 : j - 1;
        const sliceRight = j == this._dwellers[0].length ? j + 1 : j + 2;
        const currentDweller = this._dwellers[i][j];
        this._dwellers[i][j] = 0;
        const res = [i - 1, i, i + 1].map(indexRow => this._dwellers[indexRow] ?
            this._dwellers[indexRow].slice(sliceLeft, sliceRight) : [0]);
        this._dwellers[i][j] = currentDweller;
        return res;
    }
    static fromObject({ matrix, generation }) {
        return new LifeMatrix(matrix, generation);
    }
}
exports.LifeMatrix = LifeMatrix;
function isAliveFromAlive(n) {
    return +(n == 2 || n == 3);
}
function isAliveFromDead(n) {
    return +(n == 3);
}
