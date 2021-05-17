const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const auth = require("../middleware/auth");

router.post("/", [auth], async (req, res) => {
  const { participants } = req.body;

  participants.sort();
  con;
  const chatRef = firebase.firestore().collection("chats");

  const snapshot = await chatRef
    .where("participants", "==", participants)
    .select()
    .get();

  if (!snapshot.empty) {
    let id;
    snapshot.forEach(async (doc) => {
      id = doc.id;
    });

    return res.status(200).send({ idRoomChat: id });
  }

  const result = await chatRef.add({
    participants,
  });

  res.status(200).send({ idRoomChat: result.id });
});

router.get("/", [auth], async (req, res) => {
  const id = req.user.id;

  const userRef = firebase.firestore().collection("users");
  const chatRef = firebase.firestore().collection("chats");

  const snapshot = await chatRef
    .where("participants", "array-contains", id)
    .select("participants")
    .get();

  if (snapshot.empty) return res.status(200).send([]);

  const chats = [];
  let cnt = snapshot.size;

  snapshot.forEach(async (doc) => {
    let tmp = doc.data().participants;
    let user = tmp[0] !== id ? tmp[0] : tmp[1];

    const test = await userRef.doc(user).get();
    const room = {
      id: doc.id,
      name: test.data().name,
      avatar: test.data().avatar,
    };

    chats.push(room);
    cnt--;

    if (cnt === 0) res.status(200).send(chats);
  });
});

module.exports = router;
