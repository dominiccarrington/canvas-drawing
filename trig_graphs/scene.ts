/// <reference path="../base/Canvas.ts" />
/// <reference path="../base/Dom.ts" />

const maxValue = TWO_PI * 2;
const step = 0.01;
let c: Canvas;
let sinCheckbox: HTMLInputElement;
let cosCheckbox: HTMLInputElement;
let tanCheckbox: HTMLInputElement;

function setup()
{
    c = new Canvas(721, 300);
    sinCheckbox = Dom.createCheckbox("Sin Graph");
    sinCheckbox.checked = true;

    cosCheckbox = Dom.createCheckbox("Cos Graph");
    tanCheckbox = Dom.createCheckbox("Tan Graph");
}

function draw()
{
    c.background(255);
    c.noFill();
    c.stroke(0);

    c.line(0, 150, c.width, 150);
    for (let i = 0; i <= c.width; i += 90) {
        c.dashLine(i, 0, i, c.height, [5, 5, 5]);
    }

    let prevX;
    let prevY;
    
    c.font("18px Courier New");
    c.strokeWidth(2);
    if (sinCheckbox.checked) {
        prevX = 0;
        prevY = 150;
        c.stroke(255, 0, 0);
        for (let i = -maxValue; i <= maxValue; i += step) {
            let x = CanvasMath.degrees(i); // RAD -> DEG
            let y = CanvasMath.map(Math.sin(i), -1, 1, 290, 10);

            c.line(prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        }

    }

    if (cosCheckbox.checked) {
        c.stroke(0, 0, 255);
        prevX = 0;
        prevY = 10;
        for (let i = -maxValue; i <= maxValue; i += step) {
            let x = CanvasMath.degrees(i); // RAD -> DEG
            let y = CanvasMath.map(Math.cos(i), -1, 1, 290, 10);

            c.line(prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        }
    }

    if (tanCheckbox.checked) {
        c.stroke(0, 255, 0);
        prevX = 0;
        prevY = 150;
        for (let i = -maxValue; i <= maxValue; i += step) {
            let x = CanvasMath.degrees(i);
            let y = CanvasMath.map(Math.tan(i), -1, 1, 290, 10);

            for (let i = 90; i <= c.width; i += 180) {
                if (prevX < i && x > i) {
                    prevX = x;
                    prevY = y;
                }
            }
            c.line(prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        }
    }
    c.strokeWidth(1);

    c.stroke(127, 0, 255);
    c.line(c.events.mouseX, 0, c.events.mouseX, c.height);

    c.stroke(0);
    c.fill(0);
    let yVal = 18;

    if (sinCheckbox.checked) {
        let value = CanvasMath.round(Math.sin(CanvasMath.radians(c.events.mouseX)), 5);
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }
        let text = "sin(" + c.events.mouseX + ") = " + value;
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }

    if (cosCheckbox.checked) {
        let value = CanvasMath.round(Math.cos(CanvasMath.radians(c.events.mouseX)), 5);
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }
        let text = "cos(" + c.events.mouseX + ") = " + value;
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }

    if (tanCheckbox.checked) {
        let value = CanvasMath.round(Math.tan(CanvasMath.radians(c.events.mouseX)), 5);
        let infStretch = false;
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }

        for (let i = 90; i <= c.width; i += 180) {
            if (c.events.mouseX == i) {
                infStretch = true;
                break;
            }
        }

        let text = "tan(" + c.events.mouseX + ") = " + (!infStretch ? value : "∞");
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }
}
