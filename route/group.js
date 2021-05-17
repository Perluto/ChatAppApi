const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const auth = require("../middleware/auth");

router.post("/", [auth], async (req, res) => {
  const { participants, name } = req.body;

  participants.sort();

  const groupsRef = firebase.firestore().collection("groups");

  const result = await groupsRef.add({
    participants,
    name,
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
    groups.push({ id: doc.id, name: doc.data().name });
  });

  res.status(200).send(groups);
});

module.exports = router;
