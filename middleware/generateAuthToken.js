const jwt = require("jsonwebtoken");
const config = require("config");

function generateAuthToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
    config.get("jwtPrivateKey")
  );
  return token;
}

exports.generateAuthToken = generateAuthToken;
