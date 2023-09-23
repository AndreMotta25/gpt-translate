import { v4 } from "uuid";

interface ITextSelector {
    insertOnScreen(html:string):void;
    getTarget(selection: Selection | Range):void;
    backButton():{id: string, button: HTMLButtonElement}
}
interface IHideElement {
    previus: HTMLElement[];
    actual: HTMLElement[];
    id: string;
}

abstract class TextSelector implements ITextSelector {
    hideElements: IHideElement[];
    type: number;
    
    constructor() {
        this.hideElements = []
    }

    abstract insertOnScreen(html:string): void;
    abstract getTarget(selection: Selection | Range): void;

    backButton():{id: string, button: HTMLButtonElement} {
        const idButton = v4()
        const button = document.createElement('button');
        button.dataset.id = idButton;

        button.textContent = 'Voltar'

        const showPreviusText = (e:Event) => {
            const {currentTarget} = e;
            if(currentTarget instanceof HTMLButtonElement) {
                const targetPrevius = this.hideElements.find((elem) => elem.id === currentTarget.dataset.id);
                targetPrevius?.previus.forEach((prev) => {
                    prev.classList.remove('hide');
                })
                targetPrevius?.actual.forEach((active) => {
                    active.remove();
                })
            }
        }

        button.addEventListener('click', showPreviusText)
        return {id: idButton, button: button}
    }
}

export {TextSelector}