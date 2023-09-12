import auth0 from 'auth0-js';
import { authConfig } from '../config';

// Acccess infomation
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const ID_TOKEN = 'ID_TOKEN';

export default class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid',
  });

  constructor(history) {
    this.history = history;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('🚀 ~ file: Auth.js:36 ~ Auth ~ this.auth0.parseHash ~ authResult:', authResult);
        console.log('Access token: ', authResult.accessToken);
        console.log('id token: ', authResult.idToken);
        this.setSession(authResult);
      } else if (err) {
        // this.history.replace('/');
        console.log(err);
        // alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return this.accessToken || accessToken;
  }

  getIdToken() {
    const idToken = localStorage.getItem(ID_TOKEN);
    return this.idToken || idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    console.log(authResult);
    const { accessToken, idToken, expiresIn } = authResult;
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(ID_TOKEN, idToken);
    // Set the time that the access token will expire at
    let expiresAt = expiresIn * 1000 + new Date().getTime();
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    // this.history.replace('/');
    window.location.replace('/');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.clear();

    this.auth0.logout({
      return_to: window.location.origin,
    });

    // navigate to the home route
    // this.history.push('/');
    window.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    // let expiresAt = this.expiresAt;
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    let expiresAt = this.expiresAt;
    console.log(new Date().getTime() < expiresAt);
    return isLoggedIn;
  }
}
