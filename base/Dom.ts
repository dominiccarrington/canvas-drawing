class Dom
{
    public static createCheckbox(label?: string, parent = document.body): HTMLInputElement
    {
        let container = this.createElement("div");
        if (label) {
            container = this.createElement("label", container);
            container.textContent = label;
        }
        let element = this.createElement("input", container) as HTMLInputElement;
        element.type = "checkbox";

        return element;
    }

    public static createTextbox(parent = document.body): HTMLInputElement
    {
        let element = this.createElement("input", parent) as HTMLInputElement;
        element.type = "text";
        return element;
    }

    public static createSpan(text?: string, parent = document.body): HTMLSpanElement
    {
        let element = this.createElement("span");
        element.textContent = text;
        return element;
    }

    public static createElement(tag: string, parent = document.body): HTMLElement
    {
        let element = document.createElement(tag);
        parent.appendChild(element);
        return element;
    }

    public static get(finder: string): HTMLElement
    {
        let key = finder.slice(0, 1);
        
        if (key == "#") {
            return document.getElementById(finder.slice(1));
        } else if (key == ".") {
            return document.getElementsByClassName(finder.slice(1))[0] as HTMLElement;
        } else {
            return document.querySelector(finder) as HTMLElement;
        }
    }

    public static getAll(finder: string): HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element>
    {
        let key = finder.slice(0, 1);

        if (key == "#") {
            return document.getElementById(key.slice(1));
        } else if (key == ".") {
            return document.getElementsByClassName(key.slice(1));
        } else {
            return document.querySelectorAll(finder);
        }
    }
}
