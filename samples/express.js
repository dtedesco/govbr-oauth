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
