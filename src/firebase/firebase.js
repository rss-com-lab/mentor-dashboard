import * as firebase from 'firebase/app';
import 'firebase/auth';

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

  static async auth() {
    const token = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(result => result.credential.accessToken)
      .catch(error => console.error('login error', error));

    if (token) {
      const userData = await fetch(
        `https://api.github.com/user?access_token=${token}`,
      )
        .then(response => response.json())
        .catch(error => console.error('request to github api error', error));

      const user = firebase.auth().currentUser;

      user
        .updateProfile({
          displayName: userData.login,
          photoURL: userData.avatar_url,
        })
        .catch(error => console.error('update user profile error', error));
    }
  }

  static logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(error => console.error('logout error', error));
    localStorage.removeItem('currentMentor');
  }
}

export default FireBase;
