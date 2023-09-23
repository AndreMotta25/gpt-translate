import { TextSelector } from "./Shared/TextSelector";

class GroupTags extends TextSelector {
    parent: Element | null;
    selectedTags: Element[];
    previus: Element | null;

    constructor(range: Range) {
        super();
        this.type = 2;
        this.selectedTags = []
        this.getTarget(range)
    }

    insertOnScreen(html: string): void {
        const parser = new DOMParser();
        const newHtmlElements = Array.from(parser.parseFromString(html,'text/html').body.children) as HTMLElement[];
            
        const {button,id} = this.backButton();
        this.selectedTags.forEach((tag,index) => {
            tag.classList.add('hide');
            tag.insertAdjacentElement('afterend',newHtmlElements[index])
            if((newHtmlElements.length-1) === index) {
                newHtmlElements[index].appendChild(button)
            }
        })
        this.hideElements.push({previus: this.selectedTags as HTMLElement[], id: id, actual:newHtmlElements})
        this.selectedTags = []
    }
    getTarget(range: Range): void {
        this.parent = range.commonAncestorContainer as Element; 
        this.previus = range.startContainer?.parentElement?.previousElementSibling as Element

        const fragment = range.cloneContents();

        for(let element of fragment.childNodes) {
            const allElements = Array.from(this.parent?.querySelectorAll("*"));
            this.selectedTags.push(...allElements.filter(ele => element.textContent === ele.textContent))
        }
    }

}

export {GroupTags}