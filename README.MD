
## GovBr-Oauth

Módulo de autenticação no GovBr para Node-Js

## Como funciona

Este módulo implementa o processo de autenticação fornecido pelo Gov.Br conforme o manual: 
https://manual-roteiro-integracao-login-unico.servicos.gov.br/pt/stable/index.html

## Instalação

Execute o comando para a instalação do módulo
```
npm i govbr-oauth --save
```

## Funções

### authorize()
Esta função gera a url de autenticação para o login do usuário
```js
const { govbrOauth } = require("govbr-oauth");

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br", // URL para autenticação
  URL_SERVICE: "https://api.staging.acesso.gov.br", // URL dos serviços
  REDIRECT_URI: "http://localhost:3000/callback", // URL de retorno depois de autenticar
  SCOPES: "openid+email+phone+profile", // Escopos autorizados
  CLIENT_ID: "xxx", // ID do cliente fornecido pelo GOV.BR
  SECRET: "xxx" // Chave secreta fornecida pelo GOV.BR
};

const url = govbrOauth.authorize(config)
```

### getToken()
Esta função obtem o access_token para as próximas autenticações
```js
const { govbrOauth } = require("govbr-oauth");

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br", // URL para autenticação
  URL_SERVICE: "https://api.staging.acesso.gov.br", // URL dos serviços
  REDIRECT_URI: "http://localhost:3000/callback", // URL de retorno depois de autenticar
  SCOPES: "openid+email+phone+profile", // Escopos autorizados
  CLIENT_ID: "xxx", // ID do cliente fornecido pelo GOV.BR
  SECRET: "xxx" // Chave secreta fornecida pelo GOV.BR
};

const code = "xxx"; // Chave retornada no parametro 'code' da url de autorização

const token = await govbrOauth.getToken(config, code);
```

### getCredentialType()
Esta função retorna o tipo de selo do usuário
```js
const { govbrOauth } = require("govbr-oauth");

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br", // URL para autenticação
  URL_SERVICE: "https://api.staging.acesso.gov.br", // URL dos serviços
  REDIRECT_URI: "http://localhost:3000/callback", // URL de retorno depois de autenticar
  SCOPES: "openid+email+phone+profile", // Escopos autorizados
  CLIENT_ID: "xxx", // ID do cliente fornecido pelo GOV.BR
  SECRET: "xxx" // Chave secreta fornecida pelo GOV.BR
};

const token = {}; // Objeto retornado da função getToken()
const access_token = token.access_level

const token = await govbrOauth.getCredentialType(config, access_token);
```

## Exemplos

Exemplo de uso em express:

```js
const express = require("express");
const { govbrOauth } = require("govbr-oauth");

const app = express();
const port = 3000;

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br", // URL para autenticação
  URL_SERVICE: "https://api.staging.acesso.gov.br", // URL dos serviços
  REDIRECT_URI: "http://localhost:3000/callback", // URL de retorno depois de autenticar
  SCOPES: "openid+email+phone+profile", // Escopos autorizados
  CLIENT_ID: "xxx", // ID do cliente fornecido pelo GOV.BR
  SECRET: "xxx" // Chave secreta fornecida pelo GOV.BR
};

app.get("/login", (req, res) => {
  // Gera a url de autenticação
  const url = govbrOauth.authorize(config) || "";
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  // Obtem o token
  const token = await govbrOauth.getToken(config, code);
  // Obtem o tipo de selo
  govbrOauth
    .getCredentialType(config, token.access_token)
    .then(access_level => {
      token.access_level = access_level;
      res.send(token);
    });
});

app.listen(port, () => console.log(`Exemplo rodando na porta ${port}!`));

```


## Desenvolvedor

1. Clone este repositório
2. run `npm install`
3. run `node samples/express.js`

O seriviço irá rodar na porta configurado em `express.js`

## TODO

- Verificar a validação via banco
- Obter a imagem do usuário logado
- Obter dados do CNPJ

**MIT Licensed**