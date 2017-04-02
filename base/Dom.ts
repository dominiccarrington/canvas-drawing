class Dom
{
    public static createCheckbox(label?: string): HTMLInputElement
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

    public static createElement(tag: string, parent = document.body): HTMLElement
    {
        let element = document.createElement(tag);
        parent.appendChild(element);
        return element;
    }
}
