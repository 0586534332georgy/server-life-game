type ResponseNextProps = {
    generation: number,
    alives: number;
  }

export class LifeMatrix {
    generation: number;
    alives: number;

    constructor(private _dwellers: number[][]) {
        this.generation = 0;
        this.alives = 0;
    }

    get dwellers(): number[][] {
        return this._dwellers;
    }

    nextGeneration(): ResponseNextProps {
        this.alives = 0;
        this._dwellers = this._dwellers.map((__, i) => this.getNewRow(i));
        return {generation: ++this.generation, alives: this.alives};
    }

    getNewRow(i: number): number[] {
        return this._dwellers[i].map((__, j) => this.getNewCell(i, j));

    }
    getNewCell(i: number, j: number): number {
        const matrixArea = this.getMatrixArea(i, j);
        const currrentReduce: number = matrixArea.reduce((res, row) => res + row.reduce((sum, cell) => sum + cell ), 0);
        const currentCell: number = this._dwellers[i][j] ? isAliveFromAlive(currrentReduce) 
                        : isAliveFromDead(currrentReduce);
        this.alives += currentCell;
        return currentCell;

    }

    getMatrixArea(i: number, j: number): number[][] {
        const sliceLeft: number = j == 0 ? 0 : j - 1;
        const sliceRight: number = j == this._dwellers[0].length ? j + 1 : j + 2;
        const currentDweller = this._dwellers[i][j];
        this._dwellers[i][j] = 0;
        
        const res: number[][] = [i - 1, i, i + 1].map(indexRow => this._dwellers[indexRow] ?
            this._dwellers[indexRow].slice(sliceLeft, sliceRight) : [0 as number]);

        this._dwellers[i][j] = currentDweller;    

        return res;
    }
}

    function isAliveFromAlive(n: number): number {
        return +(n == 2 || n ==3) as number;
    }

    function isAliveFromDead(n: number): number {
        return +(n == 3) as number;
    }

