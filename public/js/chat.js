/*****************************************************************************
 * Object     : Arquivo responsável pela comunicação do front-end com o servidor de chat (Socket.io)
 * Date       : 2026-11-18
 * Development: Lucas Alexandre da Silva
 * Version    : 1.1
 *****************************************************************************/

// ---| Configurações |---
// O papel (ESTUDANTE ou INSTITUICAO) vem do atributo data-papel da tag <script> de cada página
const PAPEL = document.currentScript.dataset.papel

// Conecta ao servidor Socket.io (mesmo endereço de onde a página foi carregada)
const socket = io()

// ---| Elementos da tela |---
const areaChat       = document.getElementById('areaChat')
const listaMensagens = document.getElementById('listaMensagens')
const formMensagem   = document.getElementById('formMensagem')
const inputMensagem  = document.getElementById('inputMensagem')
const avisoErro      = document.getElementById('avisoErro')

// ---| Funções do chat |---

// Função responsável por entrar automaticamente na sala ao conectar (e ao reconectar)
const entrarSala = function(){
    socket.emit('entrarSala', { papel: PAPEL }, function(resposta){
        if(resposta.status_code == 200){
            areaChat.hidden = false
            inputMensagem.focus()

        } else {
            mostrarAviso(resposta.field || resposta.message)
        }
    })
}

// Função responsável por enviar somente o texto da mensagem ao servidor
const enviarMensagem = function(event){
    event.preventDefault()

    socket.emit('enviarMensagem', { texto: inputMensagem.value }, function(resposta){
        if(resposta.status_code == 201){
            inputMensagem.value = ''

        } else {
            mostrarAviso(resposta.field || resposta.message)
        }
    })
}

// Função responsável por exibir uma mensagem recebida na tela
const exibirMensagem = function(mensagem){
    const item      = document.createElement('li')
    const cabecalho = document.createElement('small')
    const texto     = document.createElement('p')

    item.classList.add(mensagem.remetente == PAPEL ? 'minha' : 'outra')

    cabecalho.textContent = (mensagem.remetente == 'ESTUDANTE' ? 'Estudante' : 'Instituição')
        + ' • ' + new Date(mensagem.data).toLocaleTimeString('pt-BR')

    // textContent impede que o conteúdo seja interpretado como HTML (proteção contra XSS)
    texto.textContent = mensagem.texto

    item.append(cabecalho, texto)
    listaMensagens.appendChild(item)
    listaMensagens.scrollTop = listaMensagens.scrollHeight
}

// Função responsável por mostrar avisos de erro por alguns segundos
const mostrarAviso = function(texto){
    avisoErro.textContent = texto
    setTimeout(function(){ avisoErro.textContent = '' }, 4000)
}

// ---| Eventos |---
formMensagem.addEventListener('submit', enviarMensagem)
socket.on('connect', entrarSala)
socket.on('novaMensagem', exibirMensagem)
socket.on('connect_error', function(){ mostrarAviso('Sem conexão com o servidor') })