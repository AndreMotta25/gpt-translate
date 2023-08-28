import { Translator } from "./entities/Translator";

window.onload = () => {
    document.head.innerHTML += '<script defer src="https://kit.fontawesome.com/2b6ab9892c.js" crossorigin="anonymous"></script>'
}

const translate = new Translator()
translate.init();