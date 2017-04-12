class Cell
{
    private i: number;
    private j: number;
    public alive = false;

    constructor(i: number, j: number)
    {
        this.i = i;
        this.j = j;
    }

    public show()
    {
        c.noFill();
        c.stroke(255);
        if (this.alive) {
            c.stroke(0);
            c.fill(0, 255, 0);
        }
        c.rect(this.i * rowLength, this.j * colLength, rowLength, colLength);
    }

    public update(): Cell
    {
        var copy = new Cell(this.i, this.j);
        
        var aliveNeighbors = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var rowCheck = this.i + i;
                var colCheck = this.j + j;
                if (i == 0 && j == 0) { continue; }
                
                if (this.isOffBounds(rowCheck, colCheck)) {
                    continue;
                }

                if (grid[rowCheck][colCheck].alive) {
                    aliveNeighbors++;
                }
            }
        }
        if (this.alive) {
            // Any live cell with fewer than two live neighbours dies, as if caused by underpopulation. (Alive -> Dead)
            if (aliveNeighbors < 2) {
                copy.alive = false;
            }
            // Any live cell with two or three live neighbours lives on to the next generation. (Alive -> Alive)
            if (aliveNeighbors == 2 || aliveNeighbors == 3) {
                copy.alive = true
            }
            // Any live cell with more than three live neighbours dies, as if by overpopulation. (Alive -> Dead)
            if (aliveNeighbors > 3) {
                copy.alive = false;
            }
        } else {
            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. (Dead -> Alive)
            if (aliveNeighbors == 3) {
                copy.alive = true;
            }
        }
        
        return copy;
    }

    private isOffBounds(i: number, j: number) {
        return i < 0 || j < 0 || i >= grid.length || j >= grid[0].length
    }
}
