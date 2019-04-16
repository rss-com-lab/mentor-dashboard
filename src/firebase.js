import * as firebase from 'firebase/app';

const API_KEY = 'AIzaSyCX-HtE8YASWxl9k6DpQblWdLOvzsEgqUs';
const AUTH_DOMAIN = 'rss-mentor-dashboard-2185d.firebaseapp.com';
const DATABASE_URL = 'https://rss-mentor-dashboard-2185d.firebaseio.com';
const PROJECT_ID = 'rss-mentor-dashboard-2185d';
const STORAGE_BUCKET = 'rss-mentor-dashboard-2185d.appspot.com';
const MESSAGING_SENDER_ID = 569694467315;

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
