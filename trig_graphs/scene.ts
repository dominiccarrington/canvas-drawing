/// <reference path="../base/Canvas.ts" />
/// <reference path="../base/Dom.ts" />

const maxValue = TWO_PI * 2;
const step = 0.005;
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

    let span = Dom.createSpan("\\(y =\\)");
    let vStretchNum = Dom.createTextbox(span);
    vStretchNum.style.width = "25px";
    vStretchNum.id = "vStretch";
    vStretchNum.setAttribute("value", "1");

    span.innerHTML += "\\(f(\\)";

    let hStretchNum = Dom.createTextbox(span);
    hStretchNum.style.width = "25px";
    hStretchNum.id = "hStretch";
    hStretchNum.setAttribute("value", "1");

    span.innerHTML += "\\(x)\\)";
}

function draw()
{
    c.background(255);
    c.noFill();
    c.stroke(0);

    c.line(0, 150, c.width, 150);
    c.line(0, 0, 0, c.height);
    for (let i = 90; i <= c.width; i += 90) {
        c.dashLine(i, 0, i, c.height, [5, 5, 5]);
    }

    let prevX;
    let prevY;
    let vStretch = parseFloat((<HTMLInputElement> Dom.get("#vStretch")).value);
    let hStretch = parseFloat((<HTMLInputElement> Dom.get("#hStretch")).value);
    
    c.strokeWidth(2);
    if (sinCheckbox.checked) {
        prevX = 0;
        prevY = 150;
        c.stroke(255, 0, 0);

        for (let i = -maxValue; i <= maxValue; i += step) {
            let x = CanvasMath.degrees(i); // RAD -> DEG
            let y = CanvasMath.map(vStretch * Math.sin(hStretch * i), -1, 1, 290, 10);

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
            let y = CanvasMath.map(vStretch * Math.cos(hStretch * i), -1, 1, 290, 10);

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
            let y = CanvasMath.map(vStretch * Math.tan(hStretch * i), -1, 1, 290, 10);

            for (let i = 90 / hStretch; i <= c.width; i += 180 / hStretch) {
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

    let yVal = 18;
    c.font("18px Courier New");
    c.stroke(127, 0, 255);
    c.line(c.events.mouseX, 0, c.events.mouseX, c.height);

    if (sinCheckbox.checked) {
        let value = CanvasMath.round(vStretch * Math.sin(hStretch * CanvasMath.radians(c.events.mouseX)), 6);
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }
        
        let text = (vStretch != 1 ? vStretch : "") + "sin(" + (hStretch != 1 ? hStretch + "*" : "") + c.events.mouseX + ") = " + value;

        c.fill(255);
        c.noStroke();
        c.rect(c.width - c.textSize(text) - 5, yVal - 18, c.width, 18);
        c.stroke(0);
        c.fill(0);
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }

    if (cosCheckbox.checked) {
        let value = CanvasMath.round(vStretch * Math.cos(hStretch * CanvasMath.radians(c.events.mouseX)), 6);
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }

        let text = (vStretch != 1 ? vStretch : "") + "cos(" + (hStretch != 1 ? hStretch + "*" : "") + c.events.mouseX + ") = " + value;

        c.fill(255);
        c.noStroke();
        c.rect(c.width - c.textSize(text) - 5, yVal - 18, c.width, 18);
        c.stroke(0);
        c.fill(0);
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }

    if (tanCheckbox.checked) {
        let value = CanvasMath.round(vStretch * Math.tan(hStretch * CanvasMath.radians(c.events.mouseX)), 6);
        let infStretch = false;
        if (value < 0.0005 && value > -0.0005) {
            value = 0;
        }

        for (let i = 90 / hStretch; i <= c.width; i += 180 / hStretch) {
            if (c.events.mouseX == i) {
                infStretch = true;
            }
        }

        let text = (vStretch != 1 ? vStretch : "") + "tan(" + (hStretch != 1 ? hStretch + "*" : "") + c.events.mouseX + ") = " + (infStretch ? "∞" : value);

        c.fill(255);
        c.noStroke();
        c.rect(c.width - c.textSize(text) - 5, yVal - 18, c.width, 18);
        c.stroke(0);
        c.fill(0);
        c.text(c.width - c.textSize(text) - 5, yVal, text);
        yVal += 20;
    }
}
