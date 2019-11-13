import express from "express";
import govbrOauth from "./index";

const app = express();
const port = 3000;

const config = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br",
  URL_SERVICE: "https://api.staging.acesso.gov.br",
  REDIRECT_URI: "https://ecrypto.com.br/callback",
  SCOPES: "openid+email+phone+profile",
  CLIENT_ID: "mtcidadao.mt.gov.br",
  SECRET:
    "bqbcionIj9noviuRphzzp9feMZV7VmF5yW_tQL3jwaGL2wKp6_gLu4r0n_swq8KV8UacAt4YjuAt9tHh5YwaQw",
  RESPONSE_TYPE: "code"
};

app.get("/login", (req, res) => {
  const url = govbrOauth.authorize(config) || "";
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const token = await govbrOauth.getToken(config, code);
  res.send(token);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
