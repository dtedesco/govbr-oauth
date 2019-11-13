
## GovBr-Oauth

Módulo de autenticação no GovBr para Node-Js

## Como funciona

Este módulo implementa o processo de autenticação fornecido pelo Gov.Br conforme o manual: 
https://manual-roteiro-integracao-login-unico.servicos.gov.br/pt/stable/index.html

Exemplo de uso em express:

```
import govbrOauth from "govbr-oauth";

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br", // URL para autenticação
  URL_SERVICE: "https://api.staging.acesso.gov.br", // URL dos serviços
  REDIRECT_URI: "https://XXXXX/callback", // URL de retorno depois de autenticar
  SCOPES: "openid+email+phone+profile", // Escopos autorizados
  CLIENT_ID: "XXXXXX", // ID do cliente fornecido pelo GOV.BR
  SECRET: "XXXXX", // Chave secreta fornecida pelo GOV.BR
};

// Chamada da url para a autenticação
app.get("/login", (req, res) => {
  const url = govbrOauth.authorize(config) || "";
  res.redirect(url);
});

// Retorno do callback
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const token = await govbrOauth.getToken(config, code);
  
  //retorna o token com os dados do usuário
  res.send(token);
});
```


## Instalação

1. Clone este repositório
2. run `npm install`
3. run `npm start`

O seriviço irá rodar na porta configurado em `example.ts`

## TODO

- Obter o selo do usuário
- Verificar a validação via banco
- Obter a imagem do usuário logado
- Obter dados do CNPJ

**MIT Licensed**