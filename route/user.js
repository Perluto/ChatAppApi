const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const firebase = require("firebase-admin");
const { validateUser } = require("../model/user");
const auth = require("../middleware/auth");
const defaultAvatarURI =
  "https://firebasestorage.googleapis.com/v0/b/chat-app-e54db.appspot.com/o/avatar%2Fdefault.jpg?alt=media&token=4760ffca-72fe-481c-97a9-58448d23fd6e";

router.post("/", async (req, res) => {
  const { email, password, name } = req.body;

  const userRef = firebase.firestore().collection("users");
  const snapshot = await userRef.where("email", "==", email).get();
  if (!snapshot.empty) {
    return res.status(400).send({ error: "Email already exists" });
  }

  const { error } = validateUser({
    name: name,
    email: email,
    password: password,
  });
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await userRef.add({
    name: name,
    email: email,
    password: passwordHash,
    avatar: defaultAvatarURI,
    online: false,
  });

  res.status(200).send("Done");
});

router.get("/", [auth], async (req, res) => {
  const user = req.user;
  const userRef = firebase.firestore().collection("users");

  const snapshot = await userRef
    .where("email", "!=", user.email)
    .select()
    .get();

  if (snapshot.empty) return res.status(200).send([]);
  const users = [];
  snapshot.forEach(async (doc) => {
    users.push(doc.id);
  });

  return res.status(200).send(users);
});

router.put("/:id/status", async (req, res) => {
  const online = req.body.online ? req.body.online : false;
  const userRef = firebase
    .firestore()
    .collection("users")
    .doc(`${req.params.id}`);

  if ((await userRef.get()).exists) await userRef.update({ online });

  return res.status(200).send("Done");
});

module.exports = router;
