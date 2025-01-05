"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomMatrix = getRandomMatrix;
function getRandomMatrix(size) {
    let res = [];
    for (let i = 0; i < size; i++) {
        res[i] = [];
        for (let j = 0; j < size; j++) {
            res[i][j] = getRandomCell();
        }
    }
    function getRandomCell() {
        return Math.trunc(Math.random() * 2);
    }
    return res;
}
