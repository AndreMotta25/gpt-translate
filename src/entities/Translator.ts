import {Icon} from './Icon.ts'
import axios from 'axios'
import { TextSelector } from './Shared/TextSelector.ts';
import { CommomText } from './CommomText.ts';
import { GroupTags } from './GroupTags.ts';
import { SomeTags } from './SomeTags.ts';


class Translator {
    content: string;
    button;
    mouseDown =  false;
    type: number;
    strategy: TextSelector;

    constructor() {
        this.button = new Icon();
    }

    async selectText(event:MouseEvent) {
        
        const selection = window.getSelection();
        if(this.mouseDown && selection?.toString() !== '' && selection) {
            this.mouseDown = false;
            this.content = selection.toString()

            const {pageX,pageY} = event; 
            
            const existsElement = window.getSelection()?.anchorNode?.parentElement as HTMLElement;

            let lengthEndContainer: number;
            let startSelection: number;
            let endSelection: number;

            for(let i=0; i < (selection.rangeCount as number); i++ ) {
                const range = selection.getRangeAt(i) 

                const fragment = selection.getRangeAt(i).cloneContents();

                startSelection = range.startOffset;
                endSelection = range.endOffset;

                lengthEndContainer = range.endContainer.textContent?.length as number

                if(range.commonAncestorContainer.nodeType === Node.TEXT_NODE) { // quando um texto unico é selecionado(não tem tags)
                    this.strategy =  new CommomText(selection);
                }
                else if(range.endContainer.parentElement !== range.commonAncestorContainer && range.startContainer.parentElement !== range.commonAncestorContainer ) { // um grupo de tags
                    this.strategy = new GroupTags(range);
                }
                else { // quando um texto tem tags dentro
                    this.strategy = new SomeTags(selection);
                }
                this.content = this.htmlToText(fragment.childNodes);
                   
            }
            //  @ts-ignore
            if(existsElement instanceof HTMLElement && startSelection === 0 && endSelection === lengthEndContainer) 
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
        
        this.strategy.insertOnScreen(response.message);
        
        console.log("Traduziu!")
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









