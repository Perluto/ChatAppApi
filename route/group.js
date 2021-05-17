const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const auth = require("../middleware/auth");
const defaultAvatarURI =
  "https://firebasestorage.googleapis.com/v0/b/chat-app-e54db.appspot.com/o/avatar%2Fdefault.jpg?alt=media&token=4760ffca-72fe-481c-97a9-58448d23fd6e";

router.post("/", [auth], async (req, res) => {
  const { participants, name } = req.body;

  participants.sort();

  const groupsRef = firebase.firestore().collection("groups");

  const result = await groupsRef.add({
    participants,
    name,
    avatar: defaultAvatarURI,
  });

  res.status(200).send({ idRoomChat: result.id, groupName: name });
});

router.get("/", [auth], async (req, res) => {
  const id = req.user.id;

  const groupRef = firebase.firestore().collection("groups");
  const snapshot = await groupRef
    .where("participants", "array-contains", id)
    .select("name")
    .get();

  if (snapshot.empty) return res.status(200).send([]);
  const groups = [];

  snapshot.forEach(async (doc) => {
    let tmp = doc.data();
    groups.push({ id: doc.id, name: tmp.name, avatar: tmp.avatar });
  });

  res.status(200).send(groups);
});

module.exports = router;
