
const getSelectedText = () => {
    var selectedText = "";
    
    if (window.getSelection) {
        selectedText = window.getSelection()?.toString() || "";
    } 
    
    return selectedText
}
export {getSelectedText}


// Adicionar um ouvinte de eventos ao documento
// document.addEventListener("mouseup", getSelectedText);