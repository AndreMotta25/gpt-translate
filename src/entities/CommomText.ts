import { TextSelector } from "./Shared/TextSelector";

class CommomText extends TextSelector {
    target: HTMLElement;

    constructor(selection: Selection) {
        super();
        this.type = 1;
        this.getTarget(selection);
    }
    getTarget(selection: Selection): void {
        this.target = selection.anchorNode?.parentElement as HTMLElement;
    }
    insertOnScreen(html: string): void {
        const nodeClone = this.target.cloneNode() as HTMLElement;

        const { button,id } = this.backButton();

        nodeClone.innerHTML = html;
        nodeClone.appendChild(button);
            
        this.target.classList.add('hide')
            
        this.target.insertAdjacentElement('afterend', nodeClone)
        this.hideElements.push({previus: [this.target as HTMLElement], id: id, actual:[nodeClone]})
    }
}
export {CommomText}