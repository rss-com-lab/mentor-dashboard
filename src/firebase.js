import * as firebase from 'firebase/app';

const API_KEY = '';
const AUTH_DOMAIN = '';
const DATABASE_URL = '';
const PROJECT_ID = '';
const STORAGE_BUCKET = '';
const MESSAGING_SENDER_ID = '';

class FireBase {
  static init() {
    const config = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER_ID,
    };
    firebase.initializeApp(config);
  }
}

export default FireBase;
