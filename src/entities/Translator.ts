import {Icon} from './Icon.ts'
import { getSelectedText } from "../utils/getText.ts";
import axios from 'axios'
import {v4} from 'uuid'

interface IHideElement {
    previus: HTMLElement[];
    actual: HTMLElement[];
    id: string;
}
class Translator {
    activeElement:Element | null; 
    content: string;
    button;
    actives: Element[];
    mouseDown =  false;
    parent: Element | null;
    selectedTags: Element[];
    previus: Element | null;
    type: number;
    hideElements: IHideElement[]

    constructor() {
        this.button = new Icon();
        this.actives = []        
        this.hideElements = [];
        this.selectedTags = [];
    }

    async selectText(event:MouseEvent) {
        
        const selection = window.getSelection();
        if(this.mouseDown && window.getSelection()?.toString() !== '' && selection) {
            this.previus = null;
            this.parent = null
            this.mouseDown = false;
            this.content = getSelectedText();

            const {pageX,pageY} = event; 
            
            this.activeElement = window.getSelection()?.anchorNode?.parentElement as HTMLElement;
            
            console.log(window.getSelection())

            
            for(let i=0; i < (selection.rangeCount as number); i++ ) {
                const range = selection.getRangeAt(i) 
                console.log(range);

                const fragment = selection.getRangeAt(i).cloneContents();
                console.log(fragment)

                if(range.commonAncestorContainer.nodeType === Node.TEXT_NODE) { // quando um texto unico é selecionado(não tem tags)
                    this.parent = selection.anchorNode?.parentElement as HTMLElement;
                    this.previus = this.activeElement.previousElementSibling as Element;
                    this.type = 1;
                }
                else if(range.endContainer.parentElement !== range.commonAncestorContainer && range.startContainer.parentElement !== range.commonAncestorContainer ) { // um grupo de tags
                    this.parent = range.commonAncestorContainer as Element; 
                    this.previus = range.startContainer?.parentElement?.previousElementSibling as Element
                    this.type = 2;
                    
                    for(let element of fragment.childNodes) {
                        const allElements = Array.from(this.parent?.querySelectorAll("*"));
                        this.selectedTags.push(...allElements.filter(ele => element.textContent === ele.textContent))
                    }
                }
                else { // quando um texto tem tags dentro
                    this.parent = range.commonAncestorContainer as Element; 
                    this.previus = this.activeElement.previousElementSibling as Element;
                    this.type = 3;
                }

                console.log(this.htmlToText(fragment.childNodes))
                this.content = this.htmlToText(fragment.childNodes)   
                console.log(this)
            }

            if(this.activeElement instanceof HTMLElement) 
            {   
                this.button.create({x:pageX+10, y:pageY+10})          
            }
            else {
                this.button.remove();  
            }
        }
        else { 
            this.button.remove();     
        }
    }    
    async translate(text:string) {
        const {organization} = await chrome.storage.local.get(['organization'])
        const {api} = await chrome.storage.local.get(['api'])

        const response = await (await axios.post("https://translate-gpt-backend.vercel.app/translate/",
        {   text: `${text}`, 
            apiKey: api,
            organization: organization
        },)).data
        
        console.log(text);
        
        if(this.activeElement && (this.type === 3 || this.type === 1)) {
            const nodeClone = this.parent?.cloneNode() as HTMLElement;

            const {button,id} = this.createButton();

            nodeClone.innerHTML = `${response.message}`;
            nodeClone.appendChild(button);
            
            this.parent?.classList.add('hide')
            
            this.parent?.insertAdjacentElement('afterend', nodeClone)
            this.hideElements.push({previus: [this.parent as HTMLElement], id: id, actual:[nodeClone]})
        }
        else if(this.type === 2) {
            const parser = new DOMParser();
            const newHtmlElements = Array.from(parser.parseFromString(response.message,'text/html').body.children) as HTMLElement[];
            
            const {button,id} = this.createButton();

            console.log(newHtmlElements)
            console.log(this.selectedTags)

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
        else {
            console.error("Elemento não achado");
        }

        console.log("Response:")
        // console.log(response)
    }

    // hideElements() {}

    createButton():{id: string, button: HTMLButtonElement} {
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

    htmlToText(tagsList: NodeListOf<ChildNode>) {
        let content = '';
        for (const tag of tagsList) {
            if(tag instanceof Element) {
                content += tag.outerHTML;
            }
            else if(tag.nodeType === 3){
                const text = tag as Text 
                content += text.data
            }
        }
        return content;
    }

    cleanSelection() {
        const selection = window.getSelection();
        if(selection) {
            selection.removeAllRanges();
        }
    }

    init() {
        // Se o mouse foi pressionado é porque provavelmente um texto foi selecionado 
        window.addEventListener("mousedown",(e) => {
            const {button} = e
            if(button === 0) {
                this.mouseDown = true;

                this.cleanSelection(); // limpa a seleção.
            }
        });
        window.addEventListener("mouseup",(e) => this.selectText(e));


        this.button.element.addEventListener('click', async () => {
            this.button.loading();
            try {
                await this.translate(this.content);
            }
            catch(e:any) {
                console.error(e.message)
            }
            finally {
                this.button.finishLoading();
            }
            
        });
    }
}
export {Translator}

/*
    * pegar o pai do elemento. => commonAncestorContainer do range
    * descobrir quais são os elementos anterior e proximo. => nextElementSibling | previousElementSibling

*/ 