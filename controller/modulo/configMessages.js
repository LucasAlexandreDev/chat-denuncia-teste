/*****************************************************************************
 * Object     : Arquivo de configuração das mensagens padrão de retorno da API
 *              ATENÇÃO: este é um modelo com as mesmas chaves usadas pelo CRUD de Cargo.
 *              Substitua pelo arquivo configMessages.js que já existe no seu projeto.
 * Date       : 2026-11-18
 * Development: Lucas Alexandre da Silva
 * Version    : 1.0
 *****************************************************************************/

const configMessages = {

    // Modelo de retorno padrão (é clonado a cada chamada nos controllers)
    DEFAULT_MESSAGE: {
        status: false,
        status_code: 0,
        message: '',
        response: {}
    },

    // ---| Sucesso |---
    SUCCESS_RESPONSE: {
        status: true,
        status_code: 200,
        message: 'Requisição realizada com sucesso!'
    },

    SUCCESS_CREATED_ITEM: {
        status: true,
        status_code: 201,
        message: 'Item criado com sucesso!'
    },

    SUCCESS_UPDATED_ITEM: {
        status: true,
        status_code: 200,
        message: 'Item atualizado com sucesso!'
    },

    SUCCESS_DELETED_ITEM: {
        status: true,
        status_code: 200,
        message: 'Item excluído com sucesso!'
    },

    // ---| Erros do cliente |---
    ERROR_BAD_REQUEST: {
        status: false,
        status_code: 400,
        message: 'Campos obrigatórios não preenchidos ou com formato inválido!',
        field: ''
    },

    ERROR_NOT_FOUND: {
        status: false,
        status_code: 404,
        message: 'Nenhum item encontrado!'
    },

    ERROR_CONTENT_TYPE: {
        status: false,
        status_code: 415,
        message: 'Tipo de conteúdo não suportado!'
    },

    // ---| Erros do servidor |---
    ERROR_INTERNAL_SERVER_MODEL: {
        status: false,
        status_code: 500,
        message: 'Erro interno no servidor (model)!'
    },

    ERROR_INTERNAL_SERVER_CONTROLLER: {
        status: false,
        status_code: 500,
        message: 'Erro interno no servidor (controller)!'
    }
}

// ---| Export |---
module.exports = configMessages
