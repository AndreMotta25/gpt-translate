
# Introdução: 
Com essa extensão você pode traduzir documentos com muito mais precisão. Basta você ter a sua conta na OpenAi e gerar uma chave de api e pronto. Atualmente a tradução só vai ocorrer do inglês para o português, mas você pode se sentir a vontade para mudar isso. Diferente de alguns tradutores que só deixam o conteudo traduzido na tela se for feita uma tradução de pagina inteira, o GPT-Translate vai deixar a tradução na sua pagina e caso você decida trazer o conteudo de volta, basta apertar o botão voltar. 
### Nota: Atualmente só vai estar disponível para o Google-Chrome.

# Como Surgiu:
Desenvolvi essa extensão porque acredito que as ferramentas de traduções atuais pecam demais em suas funções. Com a extensão usando o Chat-GPT, o contexto do texto é mantido e a tradução é bem mais precisa. 

# Algumas particularidades dessa extensão: 
  - Só comece uma nova tradução se a anterior já estiver sido concluída. Do contrario alguns bugs podem ocorrer. 
  - Essa ferramenta serve para traduzir o conteudo do texto como um todo e não só um pedaço, para isso você pode usar outras ferramentas, como o Google tradutor.  É feito desse modo para não ficar somente um pedaço traduzido em quanto o restante está na língua original, isso não faria sentido algum.
  - A tradução é feita com streams(fluxos), então caso queira ver chunck por chunck sendo pego , vá até o console do desenvolvedor.

# O Request

Para fazer a tradução, é feito um request no servidor do render. Caso você tenha o conhecimento necessário, você pode upar o seguinte projeto: "https://github.com/AndreMotta25/translate-gpt-backend" num servidor privado seu. Se fizer isso não se esqueça
de alterar a url de request da extensão. 

Usamos o endpoint /translate-stream para fazer a tradução. 

### Nota: Por ser tratar do render, as vezes a solicitação de tradução pode demorar ou até falhar, mas isso não é problema do codigo dessa extensão, mas sim uma característica do servidor do render pelo plano gratuito que torna o servidor inativo depois de um periodo de tempo sem uso.

Recomendo fortemente que upe você mesmo em um servidor mais apropriado.   

# Bibliotecas usadas: 

- axios
- uuid
- @types/chrome
- typescript
- vite

# Começando
- Para começar a usar essa ferramenta, faça um clone desse repositorio. 
- Com o Vscode aberto de um ```yarn install``` no terminal e em seguida um ```yarn build```.
- Depois do build uma pasta chamada ```dist``` será criada.
- Pronto sua extensão está pronta. Basta ir no navegador e carregar a extensão

# Planos para o Futuro
- Refazer todo o layout da extensão com o react. 
- Corrigir o bug do icone não aparecer com um duplo click
- Colocar um x para fechar o painel de credencias. 
