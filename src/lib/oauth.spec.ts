import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { authorizeURL, getToken } from "./oauth";

const CONFIG_TEST = {
  URL_PROVIDER: "https://sso.staging.acesso.gov.br",
  URL_SERVICE: "https://api.staging.acesso.gov.br",
  REDIRECT_URI: "123",
  SCOPES: "openid+email+phone+profile+govbr_empresa",
  CLIENT_ID: "123",
  SECRET: "123",
  RESPONSE_TYPE: "code"
};

describe("Gerando URL de autenticação (authorizeURL)", () => {
  test("Deve verificar se existe configuração", () => {
    //@ts-ignore
    expect(authorizeURL()).toEqual(false);
    //@ts-ignore
    expect(authorizeURL("")).toEqual(false);
    //@ts-ignore
    expect(authorizeURL(null)).toEqual(false);
  });

  test("Deve retornar uma url válida", () => {
    //@ts-ignore
    expect(authorizeURL(CONFIG_TEST)).toEqual(
      `https://sso.staging.acesso.gov.br/authorize?response_type=code&client_id=123&scope=openid+email+phone+profile+govbr_empresa&redirect_uri=123`
    );
  });
});

describe("Obtendo token do servidor (getToken)", () => {
  test("Deve verificar os parametros de entrada", () => {
    expect.assertions(1);
    //@ts-ignore
    return getToken(CONFIG_TEST).then(data => expect(data).toEqual(false));
  });

  test("Deve verificar os parametros de entrada", () => {
    expect.assertions(1);
    //@ts-ignore
    return getToken().then(data => expect(data).toEqual(false));
  });

  test("Deve validar um token inválido", () => {
    expect.assertions(1);
    //@ts-ignore
    return getToken(CONFIG_TEST, "123").then(data =>
      expect(data).toEqual(false)
    );
  });

  it("Deve validar um token válido", () => {
    expect.assertions(1);

    const code = "XPTO";
    // const data = { response: true };
    const mock = new MockAdapter(axios);

    const data = {
      access_token:
        "eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyMDgyMTkyMjQ1OSIsImF1ZCI6Im10Y2lkYWRhby5tdC5nb3YuYnIiLCJzY29wZSI6WyJlbWFpbCIsIm9wZW5pZCIsInBob25lIiwicHJvZmlsZSJdLCJhbXIiOiJwYXNzd2QiLCJpc3MiOiJodHRwczpcL1wvc3NvLnN0YWdpbmcuYWNlc3NvLmdvdi5iclwvIiwiZXhwIjoxNTczNjczMTMxLCJpYXQiOjE1NzM2Njk1MzEsImp0aSI6ImE0ZDkwNGEyLTRhNDMtNDJiMy04NmQ3LWVhZWQ1Y2I1M2MyZiJ9.FH0Al-J2cIrFMNNki5QT8IzEhR-hQheAA7A02mvgTtpmTbAVxQWyGw-JuFVdycf9kTXUB9O3PUbzzGr5uq4aUWHYefEHR2jqhl4jq1Xa80lggu40djXQLl3DAVySML6KWTFUwbVLIsxbxaQ6Jh3mX4y069xScXzOtPUDGPgnZSZroc3LqdzjbaDqHSksrCp6XqMJxR5AYTDMi_M2yonXiBiKFfiP06d1bq11AVeEiyX5qOsV2mokbckFgT7UO2dPDRAG1KF-ko0jN-20TC0YWX--jjQp_Y3dRu4oexuTmBdJASt9k7YYhKlRM4AWnX89VmjLX6_CoXKzXSxqRZIRKg",
      token_type: "Bearer",
      expires_in: 3599,
      scope: "phone email openid profile",
      id_token:
        "eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyMDgyMTkyMjQ1OSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImFtciI6InBhc3N3ZCIsInByb2ZpbGUiOiJodHRwczpcL1wvc3RhZ2luZy5hY2Vzc28uZ292LmJyIiwia2lkIjoicnNhMSIsImlzcyI6Imh0dHBzOlwvXC9zc28uc3RhZ2luZy5hY2Vzc28uZ292LmJyXC8iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJ0cnVlIiwicGljdHVyZSI6Imh0dHBzOlwvXC9zc28uc3RhZ2luZy5hY2Vzc28uZ292LmJyXC91c2VyaW5mb1wvcGljdHVyZSIsImF1ZCI6Im10Y2lkYWRhby5tdC5nb3YuYnIiLCJhdXRoX3RpbWUiOjE1NzM2NjY2NDksInNjb3BlIjpbImVtYWlsIiwib3BlbmlkIiwicGhvbmUiLCJwcm9maWxlIl0sIm5hbWUiOiJVc3VhcmlvIDIwODIxOTIyNDU5IGRlIFRlc3RlIiwicGhvbmVfbnVtYmVyIjoiMzE5ODc5NTIyMTgiLCJleHAiOjE1NzM2NzAxMzEsImlhdCI6MTU3MzY2OTUzMSwianRpIjoiNWNiMTJjNmItMzIwZi00ZWYzLWE3MDYtZTMyNTk4NGQ1MGZlIiwiZW1haWwiOiJmbGF2aWEucGVyZWlyYUBiYXNpcy5jb20uYnIifQ.ozDXjKXFBjuMJY_l6C-9nBJlJyC4XFN22z8zLCJfKB3nhQiMIVZrINqNCzsg9lSTNYO36v25b8XDIyHcfnA8_XCArzezsx0TYsP24PWfA1Y_EcM1PCXyk91Cq_PchAq7kzfOApmqD4qmIbjZhO-39eORf61qTFF0BVZUyiXI_tPCrdOhYZeLUJwuqOYAczIXTU9ynU26UBOIiAfzwmy6MtzyQxi2rI4bBZZ0KnsWxNLdrtriwMwkDc8g-Z28dRioRY9Hn4FleMlGL8hQD91hoAC2EaA54al_ba3LuoBYZggkcl5aF8Urkw3UxTTxHbiecGHLHW6CYRQtTJFQWMgNlQ",
      claims: {
        sub: "20821922459",
        email_verified: "true",
        amr: "passwd",
        profile: "https://staging.acesso.gov.br",
        kid: "rsa1",
        iss: "https://sso.staging.acesso.gov.br/",
        phone_number_verified: "true",
        picture: "https://sso.staging.acesso.gov.br/userinfo/picture",
        aud: "mtcidadao.mt.gov.br",
        auth_time: 1573666649,
        scope: ["email", "openid", "phone", "profile"],
        name: "Usuario 20821922459 de Teste",
        phone_number: "31987952218",
        exp: 1573670131,
        iat: 1573669531,
        jti: "5cb12c6b-320f-4ef3-a706-e325984d50fe",
        email: "flavia.pereira@basis.com.br"
      }
    };

    mock
      .onPost(
        `${CONFIG_TEST.URL_PROVIDER}/token?grant_type=authorization_code&code=${code}&redirect_uri=${CONFIG_TEST.REDIRECT_URI}`
      )
      .reply(200, data);

    //@ts-ignore
    return getToken(CONFIG_TEST, code).then(res => expect(res).toEqual(data));
  });
});
