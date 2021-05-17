const express = require("express");
const app = express();
const cors = require("cors");

const auth = require("./route/auth");
const user = require("./route/user");
const chat = require("./route/chat");
const group = require("./route/group");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/group", group);
app.use("/api/auth", auth);

require("./db")();

app.get("/", (req, res) => res.send("Hello"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
