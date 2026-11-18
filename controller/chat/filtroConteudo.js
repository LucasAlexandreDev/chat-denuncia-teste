/*****************************************************************************
 * Object     : Arquivo responsável pelo filtro de linguagem imprópria do chat (biblioteca bad-words)
 * Date       : 2026-11-18
 * Development: Lucas Alexandre da Silva
 * Version    : 1.0
 *****************************************************************************/

// ---| Import dos arquivos |---
const Filter     = require('bad-words')
const palavrasPt = require('./palavrasPortugues.json')

// ---| Configuração do filtro |---
// emptyList: true remove a lista padrão em inglês, evitando falsos positivos em português
const filtro = new Filter({ emptyList: true })

// Alimenta a biblioteca com as palavras em português (a verificação é feita pela biblioteca)
filtro.addWords(...palavrasPt)

// ---| Funções do filtro |---

// Função responsável por verificar se o texto contém alguma palavra imprópria
const verificarLinguagemImpropria = function(texto){
    return filtro.isProfane(texto)
}

// ---| Export das Funções |---
module.exports = {
    verificarLinguagemImpropria
}
