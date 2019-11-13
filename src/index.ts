import {authorizeURL, getCredentialType, getToken} from "./lib/oauth";

export default {
  authorize: authorizeURL,
  getToken: getToken,
  getCredentialType: getCredentialType
};
