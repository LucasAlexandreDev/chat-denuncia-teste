/*****************************************************************************
 * Object     : Arquivo responsável pela validação, tratamento e manipulação de dados do chat de denúncias
 * Date       : 2026-11-18
 * Development: Lucas Alexandre da Silva
 * Version    : 1.1
 *****************************************************************************/

// ---| Import dos arquivos |---
const crypto         = require('crypto')
const configMessages = require('../modulo/configMessages.js')
const filtroConteudo = require('./filtroConteudo.js')

// ---| Constantes |---
const PAPEIS_PERMITIDOS    = ['ESTUDANTE', 'INSTITUICAO']
const SALA_UNICA           = 'denuncias'
const TAMANHO_MAX_MENSAGEM = 500

// ---| Funções do chat |---

// Função responsável por associar o usuário à sala do chat (entrar no chat)
const entrarSala = async function(dados){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarEntradaSala(dados)

        if(validar){
            return validar // 400

        } else {
            customMessage.DEFAULT_MESSAGE.status      = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.message     = customMessage.SUCCESS_RESPONSE.message
            customMessage.DEFAULT_MESSAGE.response    = {
                papel: dados.papel,
                sala: SALA_UNICA
            }

            return customMessage.DEFAULT_MESSAGE // 200
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função responsável por enviar uma mensagem para a sala (validar, tratar e montar)
const enviarMensagem = async function(dados, sessao){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        // Garante que o usuário entrou no chat antes de enviar mensagem
        if(!sessao.sala){
            customMessage.ERROR_BAD_REQUEST.field = '[SALA] NÃO INFORMADA (ENTRE NO CHAT ANTES)'
            return customMessage.ERROR_BAD_REQUEST // 400
        }

        let validar = await validarMensagem(dados)

        if(validar){
            return validar // 400

        } else {
            let texto    = await tratarMensagem(dados.texto)
            let mensagem = montarMensagem(sessao.papel, sessao.sala, texto)

            customMessage.DEFAULT_MESSAGE.status      = customMessage.SUCCESS_CREATED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message     = customMessage.SUCCESS_CREATED_ITEM.message
            customMessage.DEFAULT_MESSAGE.response    = mensagem

            return customMessage.DEFAULT_MESSAGE // 201
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função responsável por validar os dados de entrada do usuário ao entrar no chat (routers)
const validarEntradaSala = async function(dados){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(dados == undefined || dados == null || typeof dados != 'object'){
        customMessage.ERROR_BAD_REQUEST.field = '[DADOS] INVÁLIDOS'
        return customMessage.ERROR_BAD_REQUEST

    } else if(!PAPEIS_PERMITIDOS.includes(dados.papel)){
        customMessage.ERROR_BAD_REQUEST.field = '[PAPEL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

// Função responsável por validar a mensagem recebida (apenas texto, tamanho e linguagem imprópria)
const validarMensagem = async function(dados){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    // Aceita somente o campo "texto", ou seja, sem imagem, áudio ou arquivos
    let somenteTexto = dados != null && typeof dados == 'object' && typeof dados.texto == 'string' && Object.keys(dados).every(chave => chave == 'texto')

    if(!somenteTexto){
        customMessage.ERROR_BAD_REQUEST.field = '[MENSAGEM] SOMENTE TEXTO É PERMITIDO'
        return customMessage.ERROR_BAD_REQUEST

    }

    let texto = dados.texto.trim()

    if(texto == '' || texto.length > TAMANHO_MAX_MENSAGEM){
        customMessage.ERROR_BAD_REQUEST.field = `[MENSAGEM] INVÁLIDA (ENTRE 1 E ${TAMANHO_MAX_MENSAGEM} CARACTERES)`
        return customMessage.ERROR_BAD_REQUEST

    } else if(filtroConteudo.verificarLinguagemImpropria(texto)){
        customMessage.ERROR_BAD_REQUEST.field = '[MENSAGEM] CONTÉM LINGUAGEM IMPRÓPRIA'
        return customMessage.ERROR_BAD_REQUEST

    } else {
        return false
    }
}

// Função responsável pelo tratamento do texto (remoção de caracteres de controle)
const tratarMensagem = async function(texto){
    return texto.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

// Função responsável por montar o objeto da mensagem que será enviado para a sala
const montarMensagem = function(papel, sala, texto){
    return {
        id: crypto.randomUUID(),
        sala: sala,
        remetente: papel,
        texto: texto,
        data: new Date().toISOString()
    }
}

// ---| Export das Funções |---
module.exports = {
    entrarSala,
    enviarMensagem
}