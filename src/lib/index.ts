import {authorizeURL, getCredentialType, getToken} from "./oauth";

const govbrOauth = {
  authorize: authorizeURL,
  getToken: getToken,
  getCredentialType: getCredentialType
};

export default govbrOauth;