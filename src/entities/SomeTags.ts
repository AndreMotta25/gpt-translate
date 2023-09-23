import { CommomText } from "./CommomText";

class SomeTags extends CommomText {
    constructor(selection: Selection) {
        super(selection); 
        this.type = 3; 
    }
}

export {SomeTags}