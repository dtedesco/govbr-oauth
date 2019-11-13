import axios from "axios";
import base64 from "base-64";
//@ts-ignore
import decodeJWT from "jwt-claims";

import { ConfigObject } from "../types/ConfigObject";

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
    const result = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": ":application/x-www-form-urlencoded",
        Authorization: `Basic ${base64.encode(
          config.CLIENT_ID + ":" + config.SECRET
        )}`
      }
    });
    result.data.claims = decodeJWT(result.data.id_token);
    return result.data;
  } catch (e) {
    console.log(e.message);
    return false;
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
    const result = await axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": ":application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
