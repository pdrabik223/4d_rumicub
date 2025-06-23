
export class Position {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

export class Cell {
    public value: number; // in original game <0;12> 
    public color: number; // in original game <0;3>


    constructor(value: number, color: number) {

        this.value = value
        this.color = color

    }
    static getRandomCell(): Cell {

        return new Cell(12, 2);
    }

}

export class Board {
    protected rawBoard: Map<number, Map<number, Map<number, Cell>>>;
    constructor() {

        this.rawBoard = new Map<number, Map<number, Map<number, Cell>>>();

    }

    private getYAxis(x: number): Map<number, Map<number, Cell>> | null {
        if (!this.rawBoard.has(x)) return null;
        return this.rawBoard.get(x)!

    }

    private getZAxis(x: number, y: number): Map<number, Cell> | null {
        if (this.getYAxis(x) === null) return null;
        if (!this.getYAxis(x)!.has(y)) return null;
        return this.getYAxis(x)!.get(y)!
    }

    public getCell(position: Position): Cell | null {

        if (this.rawBoard.has(position.x))
            if (this.rawBoard.get(position.x)!.has(position.y))
                if (this.rawBoard.get(position.x)!.get(position.y)!.has(position.z))
                    return this.rawBoard.get(position.x)!.get(position.y)!.get(position.z)!;

        return null

    }

    public setCell(newCell: Cell, position: Position): boolean {
        var cellReplaced = this.getCell(position) === null

        if (!this.rawBoard.has(position.x))
            this.rawBoard.set(position.x, new Map<number, Map<number, Cell>>())

        if (!this.rawBoard.get(position.x)!.has(position.y))
            this.rawBoard.get(position.x)!.set(position.y, new Map<number, Cell>())

        this.rawBoard.get(position.x)!.get(position.y)!.set(position.z, newCell);

        return cellReplaced;

    }

    public getSize(): Position {
        var x_length = this.rawBoard.values.length
        var y_length = 0
        var z_length = 0

        if (x_length > 0) {

            this.rawBoard.forEach((_, xKey) => {
                if (this.getYAxis(xKey) !== null) {

                    if (this.getYAxis(xKey) !== null) {
                        if (z_length < this.getYAxis(xKey)!.values.length) {
                            z_length = this.getYAxis(xKey)!.values.length;
                        }
                    }

                    this.getYAxis(xKey)!.forEach((_, yKey) => {

                        if (this.getZAxis(xKey, yKey) !== null)
                            if (z_length < this.getZAxis(xKey, yKey)!.values.length) {
                                z_length = this.getZAxis(xKey, yKey)!.values.length;
                            }
                    }
                    )
                };

            })


        }
        return new Position(x_length, y_length, z_length);
    };

    public forEach(func: (position: Position, cell: Cell) => void): void {

        this.rawBoard.forEach((_, xKey) => {
            if (this.getYAxis(xKey) !== null) {
                this.getYAxis(xKey)!.forEach((_, yKey) => {
                    if (this.getZAxis(xKey, yKey) !== null) {
                        this.getZAxis(xKey, yKey)!.forEach((_, zKey) => {
                            var pos = new Position(xKey, yKey, zKey);
                            func(pos, this.getCell(pos)!);
                        })
                    }
                }
                )
            };

        })
    }
};