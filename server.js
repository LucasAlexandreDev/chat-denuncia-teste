/*****************************************************************************
 * Object     : Arquivo principal do servidor de chat de denúncias (Express + Socket.io)
 * Date       : 2026-11-18
 * Development: Lucas Alexandre da Silva
 * Version    : 1.1
 *****************************************************************************/

// ---| Import dos arquivos |---
const express        = require('express')
const http           = require('http')
const path           = require('path')
const { Server }     = require('socket.io')
const chatController = require('./controller/chat/chatController.js')

// ---| Configurações do servidor |---
const PORTA  = process.env.PORT || 3000
const app    = express()
const server = http.createServer(app)
const io     = new Server(server)

// Disponibiliza as páginas HTML e os arquivos do front-end
app.use(express.static(path.join(__dirname, 'public')))

// ---| Eventos do Socket.io |---
io.on('connection', function(socket){

    // Evento responsável por associar o usuário à sala do chat
    socket.on('entrarSala', async function(dados, callback){
        let resultado = await chatController.entrarSala(dados)

        if(resultado.status_code == 200){
            socket.data.papel = resultado.response.papel
            socket.data.sala  = resultado.response.sala

            socket.join(socket.data.sala)
        }

        callback(resultado)
    })

    // Evento responsável por receber a mensagem, validar e enviar para todos da sala
    socket.on('enviarMensagem', async function(dados, callback){
        let resultado = await chatController.enviarMensagem(dados, socket.data)

        if(resultado.status_code == 201){
            // Envia a mensagem para todos da sala (inclusive para quem enviou)
            io.to(socket.data.sala).emit('novaMensagem', resultado.response)
        }

        callback(resultado)
    })
})

// ---| Inicialização |---
server.listen(PORTA, '0.0.0.0', function(){
    console.log(`Servidor do chat rodando na porta ${PORTA}`)
    console.log(`Estudante:   http://IP-DO-SERVIDOR:${PORTA}/estudante.html`)
    console.log(`Instituição: http://IP-DO-SERVIDOR:${PORTA}/instituicao.html`)
})