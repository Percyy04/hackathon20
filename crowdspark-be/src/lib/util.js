const jwt = require("jsonwebtoken");
const { ENV } = require("./env.js");

const generateToken = (user, res) => {
  const token = jwt.sign({ user }, ENV.JWT_SECRET_KEY, {
    expiresIn: ENV.JWT_EXPIRED_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  return token;
};

module.exports = generateToken;
