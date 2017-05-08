window.addEventListener("load", () => {
    if (typeof setup === "function") {
        setup();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof preload === "function") {
        preload();
    }
});

const TWO_PI = Math.PI * 2;
const PI = Math.PI;

class Canvas
{
    public width: number;
    public height: number;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public events: IEvents;

    private _fill: boolean;
    private _stroke: boolean;
    private _loop: boolean;
    private _fps: number = 60; 
    private _fpsInterval: number;
    private _startTime: number;
    private _now: number;
    private _then: number;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
        this._fill = true;
        this._stroke = true;
        this._loop = true;
        this.events = {
            mouseX: 0,
            mouseY: 0,
            keysPressed: {},
        };

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.display = "block";

        this.registerEvents();
    }

    private registerEvents()
    {
        let _draw = (timestamp: number) => {
            if (this._loop) {
                animationSystem(_draw);
            }
            this._now = Date.now();
            let elapsed = this._now - this._then;
            
            if (elapsed > this._fpsInterval) {
                this._then = this._now - (elapsed % this._fpsInterval);

                if (typeof draw === "function") {
                    draw();
                }

                if (typeof keyPressed === "function") {
                    for (var key in this.events.keysPressed) {
                        if (this.events.keysPressed[key]) {
                            keyPressed();
                            break;
                        }
                    }
                }
            }
        }

        let animationSystem = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this._startTime = this._then;
        animationSystem(_draw);

        document.addEventListener("keydown", (event) => {
            if (typeof keyDown === "function") {
                keyDown(event);
            }
            this.events.keysPressed[event.keyCode] = true;
        });

        document.addEventListener("keyup", (event) => {
            if (typeof keyUp === "function") {
                keyUp(event);
            }
            this.events.keysPressed[event.keyCode] = false;
        });

        this.canvas.addEventListener("mousemove",  (event: MouseEvent) => {
            var rect = this.canvas.getBoundingClientRect();
            this.events.mouseX = event.clientX - rect.left,
            this.events.mouseY = event.clientY - rect.top
        });

        this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
            if (typeof mouseDown === "function") {
                mouseDown(event);
            }
        });

        this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
            if (typeof mouseUp === "function") {
                mouseUp(event);
            }
        });
    }

    public frameRate(fps: number)
    {
        this._fps = fps;
        this._fpsInterval = 1000 / this._fps;
    }

    public noLoop()
    {
        this._loop = false;
    }

    public fill(r: number|Array<number>, g?: number, b?: number, a?: number)
    {
        this._fill = true;
        this.ctx.fillStyle = this.getColor(r, g, b, a)
    }

    public noFill()
    {
        this._fill = false;
    }

    public stroke(r: number|Array<number>, g?: number, b?: number, a?: number)
    {
        this._stroke = true;
        this.ctx.strokeStyle = this.getColor(r, g, b, a)
    }

    public noStroke()
    {
        this._stroke = false;
    }

    public rect(x: number, y: number, w: number, h: number)
    {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.fillAndStroke();
    }

    public line(x1: number, y1: number, x2: number, y2: number)
    {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        this.fillAndStroke();
    }

    public dashLine(x0: number, y0: number, x1: number, y1: number, spacing: Array<number>)
    {
        let distance = CanvasMath.dist(x0, y0, x1, y1);
        let xSpacing = new Array<number>(spacing.length);
        let ySpacing = new Array<number>(spacing.length);
        let drawn = 0.0;  // amount of distance drawn

        if (distance > 0) {
            let i;
            let drawLine = true; // alternate between dashes and gaps

            /*
            Figure out x and y distances for each of the spacing values
            I decided to trade memory for time; I'd rather allocate
            a few dozen bytes than have to do a calculation every time
            I draw.
            */
            for (i = 0; i < spacing.length; i++) {
                xSpacing[i] = CanvasMath.lerp(0, (x1 - x0), spacing[i] / distance);
                ySpacing[i] = CanvasMath.lerp(0, (y1 - y0), spacing[i] / distance);
            }

            i = 0;
            while (drawn < distance) {
                if (drawLine) {
                    this.line(x0, y0, x0 + xSpacing[i], y0 + ySpacing[i]);
                }
                x0 += xSpacing[i];
                y0 += ySpacing[i];
                /* Add distance "drawn" by this line or gap */
                drawn = drawn + CanvasMath.hypot(xSpacing[i], ySpacing[i]);
                i = (i + 1) % spacing.length;  // cycle through array
                drawLine = !drawLine;  // switch between dash and gap
            }
        }
    }

    public circle(x: number, y: number, r: number)
    {
        this.arc(x, y, r, 0, TWO_PI);
    }

    public arc(x: number, y: number, r: number, start: number, end: number, counter = false)
    {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, start, end, counter);
        this.ctx.closePath();
        this.fillAndStroke();
    }

    public background(r: number|Array<number>, g?: number, b?: number, a?: number)
    {
        var old = this.ctx.fillStyle;
        this.ctx.fillStyle = this.getColor(r, g, b, a);
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = old;
    }

    public text(x: number, y: number, text: string, maxWidth?: number)
    {
        if (this._fill) {
            this.ctx.fillText(text, x, y, maxWidth);
        }
        if (this._stroke) {
            this.ctx.strokeText(text, x, y, maxWidth);
        }
    }

    /**
     * TEXT FUNCTIONS
     */

    public font(font: string)
    {
        this.ctx.font = font;
    }

    // @deprecated
    // public textAlign(align: string, baseLine = "alphabetic")
    // {
    //     this.ctx.textAlign = align.toLowerCase();
    //     this.ctx.textBaseline = baseLine.toLowerCase();
    // }

    public textAlign(align: TextAlign, baseLine = TextBaseLine.ALPHABETIC)
    {
        this.ctx.textAlign = align.toString().toLowerCase();
        this.ctx.textBaseline = baseLine.toString().toLowerCase();
    }

    public textSize(text: string)
    {
        return this.ctx.measureText(text).width;
    }

    /**
     * LINE FUNCTIONS
     */

    public strokeWidth(width: number)
    {
        this.ctx.lineWidth = width;
    }

    private fillAndStroke()
    {
        if (this._fill) {
            this.ctx.fill();
        }

        if (this._stroke) {
            this.ctx.stroke();
        }
    }

    private getColor(r: number|Array<number>, g?: number, b?: number, a?: number)
    {
        if (typeof r === "object") {
            let arr = r;
            r = arr[0];
            g = arr[1];
            b = arr[2];
            a = arr.length == 4 ? r[3] : 1;
        }

        if (g == undefined && b == undefined && a == undefined) {
            g = b = r;
            a = 1;
        }

        if (b == undefined && a == undefined) {
            a = g;
            g = b = r;
        }

        if (a == undefined) {
            a = 1;
        }

        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}

class CanvasMath {
    /**
     * @see https://github.com/processing/p5.js/blob/master/src/math/calculation.js#L400
     */
    public static map(n: number, min1: number, max1: number, min2: number, max2: number): number
    {
        return ((n - min1 ) /(max1 - min1)) * (max2 - min2) + min2;
    }

    /**
     * @see https://github.com/processing/p5.js/blob/master/src/math/calculation.js#L264
     */
    public static lerp(start: number, stop: number, amt: number): number
    {
          return amt * (stop - start) + start;
    }

    /**
     * Use Pythogrous to find distance between two points
     */
    public static dist(x1: number, y1: number, x2: number, y2: number): number
    {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    public static radians(deg: number)
    {
        return deg / 180 * PI;
    }

    public static degrees(rad: number)
    {
        return rad / PI * 180;
    }

    public static round(num: number, decimal: number)
    {
        return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
    }

    /**
     * @see https://github.com/processing/p5.js/blob/master/src/math/calculation.js#L749
     */
    public static hypot(x?: number, y?: number, z?: number)
    {
        var length = arguments.length;
        var args = [];
        var max = 0;
        for (var i = 0; i < length; i++) {
            var n = arguments[i];
            n = +n;
            if (n === Infinity || n === -Infinity) {
            return Infinity;
            }
            n = Math.abs(n);
            if (n > max) {
            max = n;
            }
            args[i] = n;
        }

        if (max === 0) {
            max = 1;
        }
        var sum = 0;
        var compensation = 0;
        for (var j = 0; j < length; j++) {
            var m = args[j] / max;
            var summand = m * m - compensation;
            var preliminary = sum + summand;
            compensation = (preliminary - sum) - summand;
            sum = preliminary;
        }
        return Math.sqrt(sum) * max;
    }
}

interface IEvents
{
    mouseX: number;
    mouseY: number;
    keysPressed: Object;
}

enum TextAlign
{
    START,
    END,
    CENTER,
    LEFT,
    RIGHT
}

enum TextBaseLine
{
    ALPHABETIC,
    TOP,
    HANGING,
    MIDDLE,
    IDEOGRAPHIC,
    BOTTOM
}
