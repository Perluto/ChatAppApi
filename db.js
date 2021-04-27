var firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

module.exports = function () {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://chat-app-e54db-default-rtdb.firebaseio.com",
  });
};
