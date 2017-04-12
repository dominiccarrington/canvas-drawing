// Conway's Game Of Life
// https://en.wikipedia.org/wiki/Conway's_Game_of_Life
/// <reference path="../base/Canvas.ts" />
/// <reference path="../base/Dom.ts" />

const rows = 35; // CONST
const cols = 35; // CONST

let c: Canvas;
let grid: Array<Array<Cell>>;
let rowLength: number;
let colLength: number;
let active: boolean = false;

function setup()
{
    c = new Canvas(600, 600);
    
    let activeButton = Dom.createButton("Activate");
    activeButton.addEventListener("click", (event: MouseEvent) => {
        active = !active;

        if (active) {
            activeButton.setAttribute("value", "Deactivate");
            c.frameRate(2);
        } else {
            activeButton.setAttribute("value", "Activate");
            c.frameRate(60);
        }
    });

    rowLength = c.height / rows;
    colLength = c.width / cols;
    
    grid = [];
    for (var i = 0; i < c.width / rowLength; i++) {
        grid.push(new Array<Cell>());
        for (var j = 0; j < c.height / colLength; j++) {
            grid[i].push(new Cell(i, j));
        }
    }
}

function draw()
{
    c.background(0);

    var newGrid = new Array<Array<Cell>>();
    for (var i = 0; i < rows; i++) {
        newGrid.push([]);
        for (var j = 0; j < cols; j++) {
            grid[i][j].show();
            if (active) {
                newGrid[i].push(grid[i][j].update());
            }
        }
    }

   if (active) {
        grid = newGrid;
   }
}

function mouseDown(event: MouseEvent)
{
    let x = Math.floor(c.events.mouseX / rowLength);
    let y = Math.floor(c.events.mouseY / colLength);

    grid[x][y].alive = !grid[x][y].alive;
}
