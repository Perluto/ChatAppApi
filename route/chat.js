const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const auth = require("../middleware/auth");

router.post("/", [auth], async (req, res) => {
  const { participants } = req.body;
  const participantsId = [];

  participants.forEach((item) => {
    participantsId.push(item.id);
  });

  participants.sort();

  const chatRef = firebase.firestore().collection("chats");

  const snapshot = await chatRef
    .where("participantsId", "array-contains", participantsId[0])
    .select()
    .get();

  if (!snapshot.empty) {
    let id;
    snapshot.forEach(async (doc) => {
      id = doc.id;
    });
    return res
      .status(200)
      .send({ idRoomChat: id, roomName: participants[0]["name"] });
  }

  const result = await chatRef.add({
    participants,
    participantsId,
  });

  res
    .status(200)
    .send({ idRoomChat: result.id, roomName: participants[0]["name"] });
});

router.get("/", [auth], async (req, res) => {
  const id = req.user.id;
  const chatRef = firebase.firestore().collection("chats");
  const snapshot = await chatRef
    .where("participantsId", "array-contains", id)
    .select("participants")
    .get();

  if (snapshot.empty) return res.status(200).send([]);
  const chats = [];
  snapshot.forEach(async (doc) => {
    let tmp = doc.data().participants;
    let room = tmp[0].id !== id ? tmp[0] : tmp[1];
    room.idUser = room.id;
    room.id = doc.id;
    chats.push(room);
  });

  res.status(200).send(chats);
});

module.exports = router;
