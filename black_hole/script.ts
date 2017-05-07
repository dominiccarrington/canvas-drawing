/// <reference path="../base/Canvas.ts" />
/// <reference path="../base/Dom.ts" />

enum ColorSlot {NO_COLOR, RED, BLUE}

let c: Canvas;
let slots: Slot[];
let turn = ColorSlot.RED;
let currentValue = 1;
let winnerSpan: HTMLSpanElement;

function setup()
{
    c = new Canvas(420, 420);
    slots = new Array<Slot>();
    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 6 - col; row++) {
            slots.push(new Slot(col, row));
        }
    }
    winnerSpan = Dom.createSpan();
}

function draw()
{
    c.background(0);
    for (let slot of slots) {
        slot.draw();
    }

    c.font("10px Arial");
    c.textAlign("center", "middle");
    for (let i = 1; i < 11; i++) {
        if ((turn == ColorSlot.RED && i >= currentValue) || (turn == ColorSlot.BLUE && i > currentValue)) {
            c.fill(255, 0, 0);
        } else {
            c.noFill();
        }
        c.circle(42 * (i-0.5), 420-36, 12);
        c.text(42 * (i-0.5), 420-36, i.toString());

        if (i >= currentValue) {
            c.fill(0, 0, 255);
        }
        c.circle(42 * (i-0.5), 420-12, 12);
        c.text(42 * (i-0.5), 420-12, i.toString());
    }
}

function mouseUp(event: MouseEvent)
{
    let x = c.events.mouseX;
    let y = c.events.mouseY;
    let closest: Slot = null;
    let dist = Infinity;

    for (let slot of slots) {
        let coords = slot.getCoords();
        let d = CanvasMath.dist(x, y, coords["x"], coords["y"]);
        if (d < dist && d < 35 && slot.getColor() == ColorSlot.NO_COLOR) {
            closest = slot;
            dist = d;
        }
    }

    if (closest != null && currentValue <= 10) {
        closest.update(turn, currentValue);
        if (turn == ColorSlot.RED) {
            turn = ColorSlot.BLUE;
        } else {
            turn = ColorSlot.RED;
            currentValue++;
        }

        if (currentValue == 11) {
            calcWinner();
        }
    }
}

function calcWinner()
{
    let hole = slots.find((obj) => {
        return obj.getColor() == ColorSlot.NO_COLOR;
    });
    let destory: number[] = [
        getIndex(hole.col, hole.row + 1),
        getIndex(hole.col, hole.row - 1),
        getIndex(hole.col - 1, hole.row),
        getIndex(hole.col - 1, hole.row + 1),
        getIndex(hole.col + 1, hole.row),
        getIndex(hole.col + 1, hole.row - 1),
    ];

    let red = 0;
    let blue = 0;
    for (let num of destory) {
        if (num == -1) {
            continue;
        }
        let slot = slots[num];

        if (slot.getColor() == ColorSlot.RED) {
            red += slot.getValue();
        } else if (slot.getColor() == ColorSlot.BLUE) {
            blue += slot.getValue();
        }
    }

    if (red > blue) {
        winnerSpan.innerText = "Winner: Blue";
    } else if (red < blue) {
        winnerSpan.innerText = "Winner: Red";
    } else {
        winnerSpan.innerText = "Draw...";
    }
}

function getIndex(col: number, row: number)
{
    if (col < 0 || col > 5 || row < 0 || row > 6-col) {
        return -1;
    }
    let index = 0;
    for (let i = 0; i < col; i++) {
        index += 6-i;
    }
    index += row;
    return index;
}

class Slot
{
    public col: number;
    public row: number;
    private color = ColorSlot.NO_COLOR;
    private value = 0;

    constructor(col: number, row: number)
    {
        this.col = col;
        this.row = row;
    }

    public update(color: ColorSlot, value: number)
    {
        this.color = color;
        this.value = value;
    }

    public getColor()
    {
        return this.color;
    }

    public getValue()
    {
        return this.value;
    }

    public draw()
    {
        c.stroke(255);
        let coords = this.getCoords();

        if (this.color == ColorSlot.NO_COLOR) {
            c.noFill();
        } else if (this.color == ColorSlot.BLUE) {
            c.fill(0, 0, 255);
        } else if (this.color == ColorSlot.RED) {
            c.fill(255, 0, 0);
        }
        c.circle(coords['x'], coords['y'], 35);

        if (this.value > 0) {
            c.textAlign("center", "middle");
            c.font("32px Arial");
            c.fill(255);
            c.text(coords['x'], coords['y'], this.value.toString());
        }
    }

    public getCoords()
    {
        return {
            x: 35 * (this.col + 1) + 70 * this.row,
            y: 35 + 60 * this.col
        };
    }
}