import { OktaAuth } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  issuer: "https://dev-41929095.okta.com/oauth2/default",
  clientId: "0oalns687wcZr2KkJ5d7",
  redirectUri: "http://localhost:3000/login/callback",
});

export default oktaAuth;
