import base64 from "base-64";
//@ts-ignore
import decodeJWT from "jwt-claims";
// import fetch from "node-fetch";
require('isomorphic-fetch');


import { ConfigObject } from "../types/ConfigObject";

import jwt from "jsonwebtoken";

const generalConfig = {
  RESPONSE_TYPE: "code",
  GRANT_TYPE: "authorization_code"
};

const invalidConfig = (config: ConfigObject) => {
  if (
    config &&
    config.REDIRECT_URI &&
    config.CLIENT_ID &&
    config.SECRET &&
    config.URL_PROVIDER &&
    config.URL_SERVICE &&
    config.SCOPES
  ) {
    return false;
  }
  return true;
};

export const authorizeURL = (config: ConfigObject) => {
  if (invalidConfig(config)) {
    console.log(
      `Erro: authorize - Os parâmetros REDIRECT_URI, CLIENT_ID e SECRET, são obrigatórios`
    );
    return false;
  }
  return `${config.URL_PROVIDER}/authorize?response_type=${generalConfig.RESPONSE_TYPE}&client_id=${config.CLIENT_ID}&scope=${config.SCOPES}&redirect_uri=${config.REDIRECT_URI}`;
};

export const getToken = async (
  config: ConfigObject,
  code: string,
  redirect_uri?: string
) => {
  // Valida a configuração de entrada
  if (invalidConfig(config)) {
    console.log(
      `Erro: authorize - Os parâmetros REDIRECT_URI, CLIENT_ID e SECRET, são obrigatórios`
    );
    return false;
  }
  if (!code) {
    console.log(`Erro: authorize - O parametro code é obrigatório`);
    return false;
  }

  const url = `${config.URL_PROVIDER}/token?grant_type=${
    generalConfig.GRANT_TYPE
  }&code=${code}&redirect_uri=${redirect_uri || config.REDIRECT_URI}`;

  try {
    const res = await fetch(url, {
      method: "post",
      headers: {
        Authorization: `Basic ${base64.encode(
          config.CLIENT_ID + ":" + config.SECRET
        )}`
      }
    });
    const data = await res.json();
    if (data.error) return data;
    data.claims = decodeJWT(data.id_token);
    return data;
  } catch (e) {
    console.log(e.message);
    return e;
  }
};

export const getCredentialType = async (
  config: ConfigObject,
  accessToken: string
) => {
  // Valida a configuração de entrada
  if (invalidConfig(config)) {
    console.log(
      `Erro: authorize - Os parâmetros REDIRECT_URI, CLIENT_ID e SECRET, são obrigatórios`
    );
    return false;
  }
  if (!accessToken) {
    console.log(`Erro: authorize - O parametro accessToken é obrigatório`);
    return false;
  }
  const url = `${config.URL_SERVICE}/api/info/usuario/selo`;

  try {
    const result = await fetch(url, {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await result.json();
    return data;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

export const getCompanys = async (
    config: ConfigObject,
    accessToken: string
) => {
  // Valida a configuração de entrada
  if (invalidConfig(config)) {
    console.log(
        `Erro: authorize - Os parâmetros REDIRECT_URI, CLIENT_ID e SECRET, são obrigatórios`
    );
    return false;
  }
  if (!accessToken) {
    console.log(`Erro: authorize - O parametro accessToken é obrigatório`);
    return false;
  }
  const token: any = jwt.decode(accessToken);
  const url = `${config.URL_SERVICE}/empresas/v2/empresas?filtrar-por-participante=${token.sub}`;

  try {
    const result = await fetch(url, {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const data = await result.json();
    return data;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
