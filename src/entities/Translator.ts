import {Icon} from './Icon.ts'
import { getSelectedText } from "../utils/getText.ts";
import axios from 'axios'


class Translator {
    activeElement:Element | null; 
    content: string;
    button;
    actives: Element[]

    constructor() {
        this.button = new Icon();
        this.actives = []        
    }

    async selectText(event:MouseEvent) {
        event.stopPropagation();
        this.content = getSelectedText();
        const {pageX,pageY} = event; 
        console.log(this.content)
        this.activeElement = window.getSelection()?.anchorNode?.parentElement as HTMLElement;
        
        if(!(this.activeElement instanceof HTMLHtmlElement) && this.activeElement instanceof Element 
        && this.activeElement && this.content.length > 0  && !this.activeElement.classList.contains("gpt-1542")) {
            this.actives.forEach((elem) => elem.classList.remove('gpt-1542'));
            this.activeElement.classList.add('gpt-1542');
            this.actives.push(this.activeElement);
            this.button.create({x:pageX+10, y:pageY+10})            
        }
        else {
            this.button.remove(); 
            this.actives.forEach((elem) => elem.classList.remove('gpt-1542'));
            this.actives = [];
        }
    }    
    async translate(text:string) {
        this.button.loading();
        const response = await (await axios.post("http://localhost:3333/translate/",{text: `${text}`})).data
        
        if(this.activeElement) {
            this.button.finishLoading();
            this.activeElement.textContent = response.message;
        }
        
        console.log("Response:")
        console.log(this.activeElement)
        console.log(response)
    }
    
    init() {
        window.addEventListener("mouseup",(e) => this.selectText(e));
        window.addEventListener('dblclick', (e) => this.selectText(e))
        this.button.element.addEventListener('click', async () => {
            await this.translate(this.content);
        });
    }
}
export {Translator}