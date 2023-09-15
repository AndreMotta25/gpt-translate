const saveButton = document.querySelector("#save");
const clearButton = document.querySelector("#clear");


const apiKey = document.querySelector('#apiKey') as HTMLInputElement;
const organization = document.querySelector('#organization') as HTMLInputElement;

if(saveButton && clearButton) {
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(apiKey.value.length > 0  && organization.value.length > 0) {
            chrome.storage.local.set({api: apiKey.value}).then(() => {
                console.log('Credencias adicionadas')
                saveButton.textContent = "Salvando...";

                setTimeout(() => {
                    saveButton.textContent = "Salvo"
                },1000)
            })
            chrome.storage.local.set({organization: organization.value  }).then(() => console.log('Credencias adicionadas'))
        }
            
    })
}
