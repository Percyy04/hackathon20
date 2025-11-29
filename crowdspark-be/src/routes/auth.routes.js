const express = require("express");
const bodyParser = require("body-parser");
const {
  login,
  signup,
  logout,
  loginWithGoogle,
} = require("../service/authenServices");

const authenRouter = express.Router();

authenRouter.post("/login", login);
authenRouter.post("/signup", signup);
authenRouter.post("/login-google", loginWithGoogle);
authenRouter.post("/logout", logout);

module.exports = authenRouter;
