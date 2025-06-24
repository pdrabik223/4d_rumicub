
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

export enum Axis {
    X,
    Y,
    Z

}

export class Board {
    protected rawBoard: Map<number, Map<number, Map<number, Cell>>>;
    constructor() {
        this.rawBoard = new Map<number, Map<number, Map<number, Cell>>>();
    }
    public fromBoard(other: Board): void {
        this.rawBoard = other.rawBoard;

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
    public isEmpty(): boolean {

        return this.rawBoard.size == 0
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
    public getBoundaries(): [[number, number], [number, number], [number, number]] | null {
        // returns minimal and maximal position for every axis,
        // in case that board is empty null value will be returned
        if (this.isEmpty()) return null

        var XSpan = [9999, -9999]
        var YSpan = [9999, -9999]
        var ZSpan = [9999, -9999]


        this.rawBoard.forEach((_, xKey) => {
            if (xKey < XSpan[0])
                XSpan[0] = xKey
            else if (xKey > XSpan[1])
                XSpan[1] = xKey
            this.getYAxis(xKey)!.forEach((_, yKey) => {
                if (yKey < YSpan[0])
                    YSpan[0] = yKey
                else if (yKey > YSpan[1])
                    YSpan[1] = yKey
                this.getZAxis(xKey, yKey)!.forEach((_, zKey) => {
                    if (zKey < ZSpan[0])
                        ZSpan[0] = zKey
                    else if (zKey > ZSpan[1])
                        ZSpan[1] = zKey
                })
            })
        })

        return [[XSpan[0], XSpan[1]], [YSpan[0], YSpan[1]], [ZSpan[0], ZSpan[1]]]
    }

    public split(axis: Axis, offset: number, size: number): Board {

        var resultBoard = new Board();

        switch (axis) {
            case Axis.X: {
                this.forEach((pos, cell) => {
                    if (pos.x <= offset) resultBoard.setCell(cell, pos);
                    else resultBoard.setCell(cell, new Position(pos.x + size, pos.y, pos.z));
                })
                break;
            }
            case Axis.Y: {
                this.forEach((pos, cell) => {
                    if (pos.y <= offset) resultBoard.setCell(cell, pos);
                    else resultBoard.setCell(cell, new Position(pos.x, pos.y + size, pos.z));
                })
                break;
            }
            case Axis.Z: {
                this.forEach((pos, cell) => {
                    if (pos.z <= offset) resultBoard.setCell(cell, pos);
                    else resultBoard.setCell(cell, new Position(pos.x, pos.y, pos.z + size));
                })
                break;
            }

        }

        return resultBoard;
    }
};