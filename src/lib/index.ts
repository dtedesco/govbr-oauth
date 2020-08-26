import {authorizeURL, getCompanys, getCredentialType, getToken} from "./oauth";

const govbrOauth = {
  authorize: authorizeURL,
  getToken: getToken,
  getCredentialType: getCredentialType,
  getCompanys: getCompanys
};

export default govbrOauth;
