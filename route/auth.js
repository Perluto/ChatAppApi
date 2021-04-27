const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const firebase = require("firebase-admin");
const { generateAuthToken } = require("../middleware/generateAuthToken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const userRef = firebase.firestore().collection("users");

  const snapshot = await userRef.where("email", "==", email).get();
  if (snapshot.empty)
    return res.status(400).send({ error: "Invalid email or password." });

  let user;
  snapshot.forEach((doc) => {
    user = doc.data();
    user.id = doc.id;
  });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid email or password." });

  const token = generateAuthToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  res.send(token);
});

module.exports = router;
